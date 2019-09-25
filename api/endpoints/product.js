const express = require('express')
const router = express.Router()
const upload = require('../../config/photoStorage')
const isAuthenticated = require('../authentification/isAuthenticated')
const validator = require('../authentification/validate')

const {
    db
} = require('../db')

const {
    assetResolver,
    filterListing,
    searchQueueBuilder
} = require('../utils')


// get all products
router.get('/all', async (req, res) => {
    try {
        let products = await db.any(`
            SELECT products.product_id, products.name, products.price,
            product_photos.photo_url
            FROM products
            LEFT JOIN product_photos ON products.product_id=product_photos.product_id
            ORDER BY products.date_created DESC
        `)
        res.send(products)
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

// get recent products
router.get('/recent', async (req, res) => {
    try {
        let products = await db.any(`
            SELECT products.product_id, products.name, products.price,
            product_photos.photo_url
            FROM products
            LEFT JOIN product_photos ON products.product_id=product_photos.product_id
            ORDER BY products.date_created DESC
            LIMIT 5
        `)
        res.send(products)
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

// get product details
router.get('/details/:product_id', async (req, res) => {
    const productId = req.params.product_id

    try {
        let details = await db.one(`
            SELECT products.product_id, products.name, products.price,
            product_photos.photo_url, products.description, products.category,
            products.date_created, products.user_id
            FROM products
            LEFT JOIN product_photos ON products.product_id=product_photos.product_id
            WHERE products.product_id=$1
        `, [productId])
        let tags = await db.many(`
            SELECT tag_name 
            FROM tags
            WHERE tag_id IN (
                SELECT tag_id
                FROM product_tags
                WHERE product_id='55052488-6e73-4863-8e3b-60a376d9cf10'
            )
        `, [productId])
        details['tags'] = tags
        res.send(details)
    } catch (err) {
        console.log(err)
        res.sendStatus(204)
    }
})

// get user products
router.get('/user', async (req, res) => {
    const userId = req.user.user_id

    try {
        let myProducts = await db.any(`
            SELECT products.product_id, products.name, products.price,
            product_photos.photo_url
            FROM products
            LEFT JOIN product_photos ON products.product_id=product_photos.product_id
            WHERE products.user_id=$1
            ORDER BY products.date_created DESC
        `, [userId])
        res.send(myProducts)
    } catch (err) {
        res.sendStatus(400)
    }
})

// post new product
router.post('/', isAuthenticated, async (req, res) => {
    const {
        name,
        description,
        price,
        category
    } = req.body

    const userId = req.user.user_id
    const productArr = [userId, name, description, price, category]

    //do some validation here

    try {
        let product = await db.one(`
            INSERT INTO products(user_id, name, description, price, category)
            VALUES($1, $2, $3, $4, $5)
            returning product_id
        `, productArr)

        res.status(201)
        res.send(product)
    } catch (err) {
        console.log(err)
        res.sendStatus(400)
    }
})

// search and filter products
router.post('/search', (req, res) => {

})

// post tags to product
router.post('/tags/:tags_list', isAuthenticated, async (req, res) => {
    const tagsList = req.params.tags_list
    const {
        productId
    } = req.body

    const tags = tagsList.split('+')

    try {
        for (let tag of tags) {
            let tagId = await db.any(`SELECT tag_id FROM tags WHERE tag_name=$1`, [tag])
            if (tagId === undefined || tagId.length === 0) {
                tagId = await db.any(`INSERT INTO tags(tag_name) VALUES($1) returning tag_id`, [tag])
            }
            await db.none(`INSERT INTO product_tags(tag_id, product_id) VALUES($1, $2)`, [tagId[0].tag_id, productId])
        }
        res.sendStatus(201)
    } catch (err) {
        console.log(err)
        res.sendState(400)
    }
})

// post photos to product
router.post('/photos/:product_id', isAuthenticated, upload.array('photo', 5), (req, res) => {
    const productId = req.params.product_id
    const relativePathList = req.files.map(file => file.path.substring(10))

    if (!req.files) {
        console.log('no files were received')
        res.status(400)
        res.send('no files were received')
        return
    }

    const promises = relativePathList.map(path => db.none(`
        INSERT INTO product_photos(product_id, photo_url) 
        VALUES( (SELECT product_id FROM products WHERE product_id=$1), $2 )
    `, [productId, path]))

    Promise.all(promises).then(() => {
            res.sendStatus(201)
        })
        .catch(err => {
            console.log(err)
            res.sendStatus(400)
        })
})

// confirm product
router.put('/confirm/:product_id', isAuthenticated, async (req, res) => {
    const productId = req.params.product_id
    const userId = req.user.user_id

    try {
        const valid = await db.one(`SELECT is_admin FROM users WHERE user_id=$1`, [userId])
        if (!valid.is_admin) throw new Error('not an admin')
        await db.none('UPDATE products SET confirmation=TRUE WHERE product_id=$1', [productId])
        res.status(204)
        res.send('confirmed product')
    } catch (err) {
        console.log(err)
        res.sendStatus(401)
    }
})

module.exports = router
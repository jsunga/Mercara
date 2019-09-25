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
        let products = await db.any(`SELECT * FROM products`)
        res.send(products)
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

// get recent products
router.get('/recent', async (req, res) => {

})

// get product details
router.get('/details/:product_id', (req, res) => {

})

// get user products
router.get('/user/:user_id', async (req, res) => {

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
            let tagId = await db.any(`SELECT tag_id FROM tag WHERE tag_name=$1`, [tag])
            if (tagId === undefined || tagId.length === 0) {
                tagId = await db.any(`INSERT INTO tag(tag_name) VALUES($1) returning tag_id`, [tag])
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

    } catch (err) {

    }
})

module.exports = router
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
router.post('/product', isAuthenticated, async (req, res) => {

})

// search and filter products
router.post('/search', (req, res) => {

})

// post tags to product
router.post('/tags', isAuthenticated, (req, res) => {

})

// post photos to product
router.post('/photos/:product_id', isAuthenticated, upload.array('photo', 5), async (req, res) => {

})

// confirm product
router.put('/confirm/:product_id', isAuthenticated, async (req, res) => {

})

module.exports = router
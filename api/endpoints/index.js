const express = require('express')
const router = express.Router()

const auth = require('./auth')
const user = require('./user')
const product = require('./product')

router.use('/auth', auth)
router.use('/user', user)
router.use('/product', product)

module.exports = router
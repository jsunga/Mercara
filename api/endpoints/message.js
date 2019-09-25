const express = require('express')
const router = express.Router()
const isAuthenticated = require('../authentification/isAuthenticated')

const {
    db
} = require('../db')

// create a new chat
router.post('/new', isAuthenticated, async (req, res) => {

})

// send a message
router.post('/send', isAuthenticated, async (req, res) => {

})

// get list of messages in a chat
router.get('/get/:product_id/:recepient_id', isAuthenticated, async (req, res) => {

})

// get list of chats
router.get('/chats', isAuthenticated, async (req, res) => {

})
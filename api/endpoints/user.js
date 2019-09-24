const express = require('express')
const router = express.Router()

const {
    db
} = require('../db')

const {
    authenticate
} = require('../authentification/passport')

const bcrypt = require('bcryptjs')
const isAuthenticated = require('../authentification/isAuthenticated')
const validator = require('../authentification/validate')
const SALT = 8

// register a user
router.post('/register', (req, res, next) => {
    const {
        email,
        firstname,
        lastname,
        password
    } = req.body

    if (!validator.inputValidation(email, firstname, lastname, password, res)) return

    bcrypt.hash(password, SALT, (err, hash) => {
        db.one(`INSERT INTO users (email, firstname, lastname, password) VALUES($1, $2, $3, $4) RETURNING user_id`,
                [email, firstname, lastname, hash])
            .then(userid => {
                req.login(userid, err => {
                    if (err) return next(err)
                    res.json(userid)
                })
            })
            .catch(err => {
                validator.dbInvalidHandler(err, res)
            })
    })
})

module.exports = router
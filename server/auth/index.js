const express = require('express')
const Hashes = require('jshashes')
const router = express.Router()
const { getDb } = require('../db')
const { salt } = require('../config')

//TODO implement google oauth login flow

router.get('/hashtest', (req, res, next) => {
    const data = req.body.data
    const salted = data.password + salt
    console.log(data)
    try {
        let sha256 = new Hashes.SHA1().b64(salted)
        console.log(sha256)
    } catch (err) {
        next(err)
    }
})

router.get('/', (req, res, next) => {
    const username = (req.session.user) ? req.session.user : ''
    try {
        res.json({ username })
    } catch (err) {
        next(err)
    }
})

router.post('/login', async (req, res, next) => {
    if (req.session.user) res.status(400).send('Already logged in.')
    console.log(req.body)
    const data = req.body   
    const { username, password } = data
    const salted = password + salt
    console.log(salted)
    try {
        //Check if username exists in database or password is correct
        const db = req.db
        const users = db.collection('users')
        const user = await users.findOne({username})
        let hash = new Hashes.SHA256().b64(salted)
        if (!user || user.hash !== hash) {
            res.status(400).json({err: "User not found or incorrect password!"})
        } else {
            console.log(user)
            if (req.session) req.session.user = user.username
            req.session.user = user.username
            res.json({username: user.username})
        }
        //If all checks ut, store user in session, send userdata or some key to front end
        // if (user.hash !== hash) res.status(403).json({err: ""})a
    } catch (err) {
        next (err)
    }
})
//google login flow
router.get('/', (req, res, next) => {

})

module.exports = router;
const express = require('express')
const router = express.Router()

router.use('/posts', require('./posts'))
// router.use('/kd', require('./kd'))

module.exports = router; 

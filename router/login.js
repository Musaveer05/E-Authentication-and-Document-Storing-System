const express = require('express')
const router = express.Router()
const controller = require('../controllers/login')

router.get('/', controller.getLogForm)

router.post('/', controller.postLogForm)

module.exports = router;
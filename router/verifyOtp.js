const express = require('express');
const router = express.Router();
const controller = require('../controllers/verifyOtp')

router.get('/', controller.getOtpPage)

router.post('/', controller.postOtp)

module.exports = router;
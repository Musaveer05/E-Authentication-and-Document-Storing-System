const express = require('express')
const router = express.Router()
const controller = require('../controllers/downloadPDF')

router.post('/', controller.downloadPdf);

module.exports = router;
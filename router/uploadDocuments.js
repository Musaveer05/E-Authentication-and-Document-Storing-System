const express = require('express')
const router = express.Router()
const multer = require('multer')
const { storage } = require('../cloudinary/config')
const upload = multer({ storage })
const sessionValidation = require('../middlewares/sessionValidation')
const controller = require('../controllers/uploadDoc');

router.get('/', sessionValidation, controller.getUploadForm);

router.post('/', sessionValidation, upload.array('image'), controller.postUploadForm);

module.exports = router
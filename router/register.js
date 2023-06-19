const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const controller = require('../controllers/register')

router.use(
    fileUpload({
        limits: {
            fileSize: 10000000,
        },
        abortOnLimit: true,
    })
)

router.get('/', controller.getRegForm);

router.post('/', controller.postRegForm);

module.exports = router;

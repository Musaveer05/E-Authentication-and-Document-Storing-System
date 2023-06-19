const express = require('express');
const router = express.Router();
const controller = require('../controllers/deleteImg');

router.post('/', controller.deleteImg);


module.exports = router;
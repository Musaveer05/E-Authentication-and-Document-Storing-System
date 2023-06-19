const express = require('express');
const router = express.Router();
const path = require('path');
const controller = require('../controllers/userProfile')
const sessionValidation = require('../middlewares/sessionValidation');

router.use(express.static(path.join(__dirname, '../upload')));

router.get('/',sessionValidation, controller.getProfile);

module.exports = router;           
const express = require('express');
const router = express.Router();
const sessionValidation = require('../middlewares/sessionValidation');
const controller = require('../controllers/viewDoc')

router.get('/', sessionValidation, controller.viewDocs);


module.exports = router;
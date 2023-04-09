const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const sessionValidation = require('../middlewares/sessionValidation');
const path = require('path');

router.use(express.static(path.join(__dirname, '../upload')));

router.get('/', sessionValidation, (req, res) => {

    let email = req.session.email;

    const imagePath = `${email}.jpg`;

    res.render('UserProfile.ejs', { imagePath });

});

module.exports = router;           
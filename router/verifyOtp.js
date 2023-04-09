const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const emailOtpMod = require('../models/userEmailOtp');

router.get('/', (req, res) => {
    res.render('verifyotp');
})

router.post('/', async (req, res) => {
    const { otp } = req.body;

    const strotp = otp.toString();
    const email = req.session.email;

    if (!email) {
        res.redirect('/register');
    }
    else {
        const userMail = await emailOtpMod.findOne({ email });
        const validotp = await bcrypt.compare(strotp, userMail.emailOtp);

        if (validotp) {
            await User.updateOne({ email: email }, { $set: { verified: true } });
            delete req.session.email;
            res.redirect('/');
        }
        else {
            res.redirect('/verifyOtp');
        }

    }
});

module.exports = router;
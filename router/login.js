const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.get('/', (req, res) => {
    res.render('reglogin/login');
})

router.post('/verifyotp', async (req, res) => {
    const { user_id, otp } = req.body;

    const strotp = otp.toString();

    const userMail = await emailOtpMod.findOne({ user_id });
    const Email = userMail.email;
    const validotp = await bcrypt.compare(strotp, userMail.emailOtp);

    if (validotp) {
        await User.updateOne({ email: Email }, { $set: { verified: true } });
        console.log("Yes verified otp");
        res.redirect('/');
    }
    else {
        res.redirect('/register/verifyotp');
        console.log("Not verified");
    }

});

router.post('/', async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user.verified === false) {
        res.redirect('/');
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
        req.session.user_id = user._id;
        req.session.email = email;
        // console.log("IN login", req.session.user_id);
        res.redirect('/UserProfile');

    } else {
        res.send("Try again")
    }

});

module.exports = router;
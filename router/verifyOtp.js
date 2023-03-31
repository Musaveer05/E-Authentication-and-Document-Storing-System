const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const emailOtpMod = require('../models/userEmailOtp');

router.get('/', (req,res) =>{
    res.render('verifyotp');
})

router.post('/', async (req, res) => {
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
        res.redirect('/verifyOtp');
        console.log("Not verified");
    }
});

module.exports = router;
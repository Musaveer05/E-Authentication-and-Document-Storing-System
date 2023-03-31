const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.get('/', (req,res) =>{
    res.render('login');
})

async function emailsend(email) {

    let sendotp = Math.floor(1000 + Math.random() * 9000).toString();
    console.log("Plain otp is ", sendotp);

    let hashotp = await bcrypt.hash(sendotp, 12);

    let mailDetails = {
        from: 'mvmanekia2002@gmail.com',
        to: `${email}`,
        subject: 'Test mail',
        text: `Your current otp is: ${sendotp} . Thanking you in anticipation.`
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log('Error occurs');
            return false;
        } else {
            console.log('Email sent successfully');
            return true;
        }
    });

    const emailUser = new emailOtpMod({
        email: email,
        emailOtp: hashotp,
        createdAt: Date.now(),
        expiresAt: Date.now() + 60000,
    })

    try {
        await emailUser.save();
    }
    catch (e) {
        return false;
    }
};

// verify email function
// if date.expires

router.get('/verifyotp', (req,res) =>{
    res.render('verifyotp');
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

router.post('/', async(req,res) =>{

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if(user.verified === false){
        res.redirect('/');
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
        req.session.user_id = user._id;
        // const f = user.find({flag});
        // if(f === false){
        //     res.redirect('/verifyotp');
        // }
        // else
        // res.send("You are logged in, Welcome!!!")
        res.redirect('/UserProfile');

    } else {
        res.send("Try again")
    }

});

module.exports = router;
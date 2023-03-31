const express = require('express');
const validator = require('email-validator');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');
// const joi = require('joi');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const emailOtpMod = require('../models/userEmailOtp');
const flash =  require('connect-flash');

let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mvmanekia2002@gmail.com',
        // pass: 
    }
});

var str;
router.get('/', (req, res) => {
    let arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let emptyarr = [];

    for (let i = 1; i < 7; i++) {
        emptyarr.push(arr[Math.floor(Math.random() * arr.length)]);
    }
    str = emptyarr.join("");
    res.render('register', { captcha: str });
})


async function emailexists(email) {
    const find = await User.findOne({email}).exec();

    if(find === null) {
        console.log("true");
        return true;
    }
    else return false;

}

async function emailResult(email) {
    if (!validator.validate(email)) {
        console.log("Enter valid email");
        return false;
    }
    else return true;
}

const passwordResult = async (password, confirmPassword) => {

    const reg = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$";

    if(password !== confirmPassword){
        console.log('password is not same as confirm password');
        return false;
    }
    else if(password.match(reg) === null || confirmPassword.match(reg) === null){
        console.log('password does not match the format');
        return false;
    }
    else return true;
    // let c = 0, c1 = 0, c2 = 0, c3 = 0;
    // for (let i of password) {
    //     if (i >= 'a' && i <= 'z') c++;
    //     else if (i >= 'A' && i <= 'Z') c1++;
    //     else if (i >= '0' && i <= '9') c2++;
    //     else c3++;
    //     i++;
    // }

    // if (c == 0 || c1 == 0 || c2 == 0 || c3 == 0 || password.length <= 6 || password.length >= 20) {
    //     console.log("Password should Contain Atleast 1 Uppercase and 1 Lowercase \n, 1 Number and 1 special character");
    //     return false;
    // }

    // if (password !== confirmPassword) {
    //     console.log("Password and Confirm Password Does not match");
    //     return false;
    // }
    // else return true;
}

const captchaResult = async (captcha) => {

    if (captcha !== str) {
        console.log("Enter Valid Captcha");
        return false;
    }
    else {
        return true;
    }
}

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


router.post('/', async (req, res) => {
    const { email, password, confirmPassword, dob, phoneNo, captcha } = req.body;

    const hash = await bcrypt.hash(password, 12);

    const user = new User({
        email,
        password: hash,
        dob,
        phoneNo,
        verified: false
    })

    const check = await emailexists(email);

    if(check === false){
        console.log("Email Already Exits");
        req.flash('Exists', 'Email Already Exists');
        res.redirect('/');
    }
    else{
        const checkEmail = await emailResult(email);
        const checkPass = await passwordResult(password, confirmPassword);
        const checkCaptcha = await captchaResult(captcha);

        if (checkEmail && checkPass && checkCaptcha ) {
            console.log("All valid");
            const sendemail = await emailsend(email);
            if (sendemail === false) {
                res.redirect('/');
            }
            else {
                await user.save();
                res.redirect('/verifyOtp');
            }
        }
        else console.log("Enter valid Details");
    }


});

module.exports = router;
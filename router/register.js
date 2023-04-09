const express = require('express');
const validator = require('email-validator');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');
// const joi = require('joi');
const User = require('../models/user');
// const flash = require('connect-flash');
const sendEmail = require('../userDefined/sendemail');
const fileUpload = require('express-fileupload');
const path = require('path');
const crypto = require('crypto');
const NodeRsa = require('node-rsa');

router.use(
    fileUpload({
        limits: {
            fileSize: 10000000,
        },
        abortOnLimit: true,
    })
)


var str;
router.get('/', (req, res) => {
    let arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let emptyarr = [];

    for (let i = 1; i < 7; i++) {
        emptyarr.push(arr[Math.floor(Math.random() * arr.length)]);
    }
    str = emptyarr.join("");
    res.render('reglogin/register', { captcha: str });
})


async function emailexists(email) {
    const find = await User.findOne({ email }).exec();

    if (find === null) {
        console.log("Email  does not exists already");
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

    if (password !== confirmPassword) {
        console.log('password is not same as confirm password');
        return false;
    }
    else if (password.match(reg) === null || confirmPassword.match(reg) === null) {
        console.log('password does not match the format');
        return false;
    }
    else return true;

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

const validateImg = async (img) => {

    if (!img) {
        console.log("Image in not there");
        return false;
    }

    if (img.size > 10000000) {
        console.log("Image size is greater than");
        return false;
    }

    // if (! /^img/.test(img.mimetype)) {
    if (!/^image\/(jpg|jpeg|png|gif)$/i.test(img.mimetype) && !/\.(jpg|jpeg|png|gif)$/i.test(img.name)) {
        console.log("Image mime type not supported");
        return false;
    }

    return true;
}

router.post('/', async (req, res) => {
    const { email, password, confirmPassword, dob, captcha } = req.body;
    const img = req.files.img;

    const hash = await bcrypt.hash(password, 12);

    const ExistingEmail = await emailexists(email);

    if (ExistingEmail === false) {
        console.log("Email Already Exits");
        req.flash('Exists', 'Email Already Exists');
        res.redirect('/');
    }
    else {
        const checkEmail = await emailResult(email);
        const checkPass = await passwordResult(password, confirmPassword);
        const checkCaptcha = await captchaResult(captcha);
        const checkImg = await validateImg(img);

        if (checkEmail && checkPass && checkCaptcha && checkImg) {
            console.log("All valid");

            const key = new NodeRsa({ b: 512 });
            const privateKey = key.exportKey('private');
            const publicKey = key.exportKey('public');

            const fileExtension = path.extname(img.name);

            await img.mv('upload/' + email + fileExtension);
            req.session.email = email;

            await sendEmail(email);

            console.log("IN register post email send is :- ", email);
            // await user.save();
            const user = new User({
                email,
                password: hash,
                dob,
                privateKey,
                publicKey,
                verified: false
            })
            await user.save();

            res.redirect('/verifyOtp');
        }
        else console.log("Enter valid Details");
    }

});

module.exports = router;
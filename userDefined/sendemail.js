const bcrypt = require('bcrypt');
const nodemailer  = require('nodemailer');
const emailOtpMod = require('../models/userEmailOtp');

let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mvmanekia2002@gmail.com',
        pass: 'quqbumxmpmizmoxb',
    }
});

async function emailsend(email) {
    console.log("In sendemail route", email);
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
            console.log(err);
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


module.exports = emailsend;
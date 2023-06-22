const bcrypt = require('bcrypt');
const User = require('../models/user');
const emailOtpMod = require('../models/userEmailOtp');

module.exports.getOtpPage = (req, res) => {
    if(!req.session.email) return res.redirect('/register');
    res.render('verifyotp');
}

module.exports.postOtp = async (req, res) => {
    const { otp } = req.body;

    const strotp = otp.toString();
    const email = req.session.email;

    console.log("email is", email);

    if (!email) {
        return res.redirect('/register');
    }
    else {
        const userMail = await emailOtpMod.findOne({ email });
        const validotp = await bcrypt.compare(strotp, userMail.emailOtp);

        if (validotp) {
            await User.updateOne({ email: email }, { $set: { verified: true } });
            delete req.session.email;
            req.flash('Exists','OTP Verification Successfully done');
            return res.redirect('/');
        }
        else {
            return res.redirect('/verifyOtp');
        }

    }
}

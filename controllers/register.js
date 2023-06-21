const bcrypt = require('bcrypt');
const User = require('../models/user');
const sendEmail = require('../userDefined/sendemail');
const path = require('path');
const NodeRsa = require('node-rsa');
const JoiSchema = require('../userDefined/user_validation');

var str
module.exports.getRegForm = (req, res) => {
    let arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let emptyarr = [];

    for (let i = 1; i < 7; i++) {
        emptyarr.push(arr[Math.floor(Math.random() * arr.length)]);
    }
    str = emptyarr.join("");
    console.log(req.flash('error')); // Log the value of req.flash('error')

    res.render('reglogin/register', { captcha: str, messages: req.flash('error') });
}

module.exports.postRegForm = async (req, res) => {

    try{

        const {email , password, confirmPassword, dob, captcha} = req.body;
        const img = req.files.img;

        const EmailExist = await User.findOne({email});  
        if(EmailExist){
            throw new Error('Email Already Exist');
        }
    
        const validResult = JoiSchema.validate({
            email: email,
            password:password,
            confirmPassword:confirmPassword
        })

        if(validResult.error){
            throw new Error('Password Must Contain atleast 1 UpperCase, 1 LowerCase, 1 Digit, 1 Special Character and minimum of 6 Characters')
        }  

        await captchaResult(captcha)
        await validateImg(img)

        const hash = await bcrypt.hash(password, 12);
        const key = new NodeRsa({b : 512})
        const privateKey = key.exportKey('private')
        const publicKey = key.exportKey('public')
        
        const fileExtension = path.extname(img.name)
        await img.mv('upload/' + email + fileExtension)
        req.session.email = email
        await sendEmail(email)

        const user = new User({
            email,
            password:hash,
            dob, 
            privateKey,
            publicKey,
            verified:false
        })

        await user.save();
        res.redirect('/verifyOtp');
    }
    catch(error){
        
        console.log(error.message)
       
        if(error.message === 'Email Already Exist'){
            await req.flash('Exists', error.message);
            res.redirect('/');
        }
        else{
            // await req.flash('error', error.message);
            // console.log("error is flash", req.flash('error'));
            // res.redirect('/register');
            await req.flash('error', error.message);
            const errorMessage = error.message;
            res.render('reglogin/register', { errorMessage });
        }
    }
}


const captchaResult = async (captcha) => {

    if (captcha !== str) {
        console.log("Enter Valid Captcha");
        throw new Error('Invalid Capthca')
    }
    return true;
}

const validateImg = async (img) => {

    if (!img) {
        throw new Error('Image is required')
    }

    if (img.size > 5000000) {
        throw new Error('Image size must be less than 5MB')
    }

    if (!/^image\/(jpg|jpeg|png|gif)$/i.test(img.mimetype) && !/\.(jpg|jpeg|png|gif)$/i.test(img.name)) {
        throw new Error('Image Format must be png or jpg or jpeg or gif')
    }

    return true;
}

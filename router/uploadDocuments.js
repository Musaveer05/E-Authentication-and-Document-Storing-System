const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const sessionValidation = require('../middlewares/sessionValidation');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const tesseract = require('node-tesseract-ocr');
const NodeRSA = require('node-rsa');
const Data = require('../models/data');
const User = require('../models/user');

const config ={
    lang: "eng",
    oem: 1,
    psm: 3.
}

router.use(fileUpload());

router.use(express.static(path.join('upload/')));

router.get('/', sessionValidation,(req,res) =>{
    res.render('UploadDocument');
})

router.post('/', (req, res) => {
    // Log the files to the console
    const { image } = req.files;

    console.log(req.session.email);

    if (!image) return res.sendStatus(400);

    image.mv(image.name);

    const get = image.name;

    tesseract
        .recognize(`${get}`, config)
        .then(async (text) => {

            const dateOfBirthRegex = /\b\d{2}\/\d{2}\/\d{4}\b/;

            const match = text.match(dateOfBirthRegex);

            let dateofBirth;
            if (match) {
                dateofBirth = match[0];
                console.log("Date of birth is ", dateofBirth);
            }
            else console.log("Date of birth Not found");

            const aadhaarNumberRegex = /\b\d{4}\s\d{4}\s\d{4}\b/;

            const match2 = text.match(aadhaarNumberRegex);

            let aadharNumber;
            if (match2) {
                aadharNumber = match2[0];
                console.log("The aadhar Number is ", aadharNumber);
            }
            else console.log("aadhar Number Not found");

            removeNow(get); 

            if(!match && !match2){
                res.redirect('/UserProfile/UploadDocuments');
            }
            else{
                const email = req.session.email;
                const user = await User.findOne({ email });

                console.log("Correctly imported");
                const key = new NodeRSA(user.publicKey);
                const encrypted1 = key.encrypt(aadharNumber, 'base64');

                const data = new Data({
                    email,
                    Aadhar: encrypted1,
                    DOB: dateofBirth
                })

                await data.save();

                res.redirect('/UserProfile');
            }

        })
        .catch((error) => {
            console.log(error.message)
        })

});

function removeNow(path){
    fs.unlink(path, (err) =>{
        if(err){
          console.log(err);
          return;
        }
        console.log("image deleted successfully");
      })
}

module.exports = router;           

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const sessionValidation = require('../middlewares/sessionValidation');
const fs = require('fs');
const tesseract = require('node-tesseract-ocr');
const NodeRSA = require('node-rsa');
const UserData = require('../models/user');
const Data = require('../models/data');

router.get('/', sessionValidation, (req,res)=>{
    res.render('viewDocument');
})

router.post('/', async (req,res) =>{

    try {
        const email = req.session.email;
    
        // Find user in database
        const user = await UserData.findOne({ email });
    
        if (!user) {
          return res.status(400).send('User not found');
        }
        
        const user1 = await Data.findOne({email});
        const encrypted = user1.Aadhar;

        console.log(encrypted);
        // Decrypt message using user's private key
        const key = new NodeRSA(user.privateKey);

        console.log("User Private key is", key);

        const decrypted = key.decrypt(encrypted, 'utf8');
    
        return res.json({ decrypted });
      } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
      }

})



module.exports = router;
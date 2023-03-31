const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const session =  require('express-session');



router.get('/', (req,res)=>{
    if (!req.session.user_id) {
        res.redirect('/login')
    }
    else res.render('UserProfile.ejs');
});

module.exports = router;
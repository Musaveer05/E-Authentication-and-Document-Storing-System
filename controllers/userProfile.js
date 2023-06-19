// const sessionValidation = require('../middlewares/sessionValidation');
// const path = require('path');

module.exports.getProfile = (req, res) => {

    let email = req.session.email;
    const imagePath = `${email}.jpg`;
    res.render('UserProfile.ejs', { imagePath, messages:req.flash('success') });

}
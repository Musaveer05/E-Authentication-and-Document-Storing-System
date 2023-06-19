const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports.getLogForm = (req, res) => {
    res.render('reglogin/login', { messages: req.flash('loginError') });
};


module.exports.postLogForm = async (req, res) => {

    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            throw new Error('Not found');
        }
        else if(!user.verified){
            throw new Error('NotVerified');
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if(validPassword){
            req.session.user_id = user._id;
            req.session.email = email;
            res.redirect('/UserProfile');
        }
        else{
            throw new Error('Invalid Credentials');
        }
        
    } catch (error) {
        
        if(error.message === 'Not found'){
            req.flash('error', 'You need to register First, Email Does not found');
            return res.redirect('/register');
        }
        else if(error.message === 'NotVerified'){
            return res.redirect('/');
        }
        else if(error.message === 'Invalid Credentials'){
            req.flash('loginError', 'Incorrect Email Or Password')
            return res.redirect('/login');
        }

    }
}

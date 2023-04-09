module.exports = function (req, res, next) {
    if (req.session.cookie.expires > new Date() && req.session.user_id) {
        // Session is valid, so call next middleware function
        next();
    } else {
        // Session is invalid, so redirect the user to the login page
        req.session.destroy();
        res.redirect('/login');
    }
};

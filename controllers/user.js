const User = require("../models/user");
const passport = require('passport');


module.exports.signup=async (req, res) => {
    try {
        let { username, password, email } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            req.flash('error', 'Username already exists');
            return res.redirect('/user/signup');
        }

        const newUser = new User({ username, email });
        const regUser = await User.register(newUser, password);
        console.log(regUser);

        req.login(regUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to my website!');
            res.redirect('/listings');
        });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/user/signup');
    }
}

module.exports.login=(req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            req.flash('error', info.message || 'Login failed');
            return res.redirect('/user/login');
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome back!');

            const redirectUrl = res.locals.redirecturl || '/listings';
            delete req.session.redirecturl;  
            return res.redirect(redirectUrl);
        });
    })(req, res, next);
}

module.exports.logout=(req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have logged out");
        res.redirect('/listings');
    });
}
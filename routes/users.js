const express = require('express');
const router = express.Router();
const passport = require('passport');
const {saveredirecturl} = require("../public/javascripts/middleware");
const userController = require("../controllers/user");

router.use(express.urlencoded({ extended: true }));


router.get('/', (req, res) => {
    res.render('users/login');
});


//signup
router.route('/signup')
    .get( (req, res) => {
    res.render('users/signup');
})
.post( userController.signup);


//login
router.route('/login')
    .get( (req, res) => {
    res.render('users/login');
})
.post( saveredirecturl, (userController.login));


router.get("/logout", (userController.logout));

module.exports = router;

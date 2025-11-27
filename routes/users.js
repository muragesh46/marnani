const express = require('express');
const router = express.Router();
const passport = require('passport');
const { saveredirecturl } = require("../public/javascripts/middleware");
const userController = require("../controllers/user");

router.use(express.urlencoded({ extended: true }));


router.get('/', (req, res) => {
    res.render('users/login');
});


 
router.route('/signup')
    .get((req, res) => {
        res.render('users/signup');
    })
    .post(userController.signup);


 
router.route('/login')
    .get((req, res) => {
        res.render('users/login');
    })
    .post(saveredirecturl, (userController.login));


router.get("/logout", (userController.logout));

 
const profileController = require("../controllers/profile");
const { isLoggedIn } = require("../public/javascripts/middleware");

router.get('/profile', isLoggedIn, profileController.showProfile);
router.post('/profile/update', isLoggedIn, profileController.updateProfile);
router.post('/profile/password', isLoggedIn, profileController.updatePassword);

module.exports = router;

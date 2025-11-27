const express = require('express');
const path = require('path');

const listing = require("../models/listing");
const methodOverride = require("method-override");
const wrapasync = require("../public/javascripts/errhandling")
const router = express.Router();
const flash = require("connect-flash");
const { isLoggedIn, isowner } = require("../public/javascripts/middleware");
const listingcontroller = require("../controllers/listing");
const { storage } = require("../config/cloudconfig");
const multer = require('multer')
const upload = multer({ storage });



router.use(express.urlencoded({ extended: true }));
router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static("public"));
router.use(methodOverride("_method"));
router.use(flash());



 
router
    .route('/')
    .get(wrapasync(listingcontroller.index))


 
router
    .route("/new")
    .get(isLoggedIn, async (req, res) => {
        res.render('new');
    })
    .post(isLoggedIn, upload.single('image'), wrapasync(listingcontroller.newlisting))


 
router.route('/:id').
    get(wrapasync(listingcontroller.showlisting))
     
    .put(isLoggedIn, isowner, wrapasync(listingcontroller.updatelisting))
     
    .delete(isLoggedIn, isowner, wrapasync(listingcontroller.deletelisting))


 
router.get('/:id/edit', isLoggedIn, isowner, wrapasync(listingcontroller.editlisting))



module.exports = router;

const express = require('express');
const path = require('path');

const listing=require("../models/listing");
const methodOverride = require("method-override");
const wrapasync=require("../public/javascripts/errhandling")
const router = express.Router();
const flash = require("connect-flash");
const {isLoggedIn, isowner} = require("../public/javascripts/middleware");
const listingcontroller=require("../controllers/listing");
const {storage}=require("../config/cloudconfig");
const multer  = require('multer')
const upload = multer({ storage });



router.use(express.urlencoded({ extended: true }));
router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static("public"));
router.use(methodOverride("_method"));
router.use(flash());



/* GET users listing. */
router
    .route('/')
    .get(wrapasync(listingcontroller.index))


//new
router
    .route("/new")
    .get(isLoggedIn, async (req,res)=>{
        res.render('new');
    })
    .post(isLoggedIn, upload.single('image'), wrapasync(listingcontroller.newlisting))


//show
router.route('/:id').
get( wrapasync(listingcontroller.showlisting))
//update
.put(isLoggedIn,isowner, wrapasync(listingcontroller.updatelisting))
//deleate
.delete(isLoggedIn,isowner,wrapasync(listingcontroller.deletelisting))


//edit
router.get('/:id/edit',isLoggedIn,isowner,wrapasync(listingcontroller.editlisting))

router.use((err, req, res, next) => {
    const { statuscode, msg } = err;
    res.status(statuscode || 500).send(msg || "Something went wrong");
});

module.exports = router;

const express = require('express');
const path = require('path');

const methodOverride = require("method-override");
const wrapasync=require("../public/javascripts/errhandling")
const expresserr=require("../public/javascripts/expresserr")
const router = express.Router({mergeParams: true});
const {validatereview, isLoggedIn} = require("../public/javascripts/middleware");
const reviewController = require("../controllers/reviews");



router.use(express.urlencoded({ extended: true }));
router.use(express.static(path.join(__dirname, 'public')));
router.use(methodOverride("_method"));


//review/show
router.post('/',isLoggedIn, validatereview,wrapasync(reviewController.showreview))

//show/review/delete
router.delete("/:reviewId",isLoggedIn, wrapasync(reviewController.deletereview))

router.all('*',(req,res,next)=>{
    next(new expresserr(404,"Not Found"));
})
router.use((err, req, res, next) => {
    const { statuscode, msg } = err;
    res.status(statuscode || 500).send(msg || "Something went wrong");
});


module.exports = router;
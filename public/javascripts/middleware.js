const listing = require("../../models/listing");
const {reviewSchema} = require("../../models/Schema");
const expresserr = require("./expresserr");
const Review = require('../../models/review');


module.exports.isLoggedIn = (req,res,next)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirecturl=req.originalUrl;
        req.flash("error","You are not logged in");
        return res.redirect('/user/login');
    }
    next();
}

module.exports.saveredirecturl = (req,res,next)=>{
    if(req.session.redirecturl){
        res.locals.redirecturl=req.session.redirecturl;

    }
    next();
};

module.exports.isowner=async (req,res,next)=>{
    let {id} = req.params;
    let list = await listing.findById(id);
    if (!list.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You don't have permission to edit this list.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validatereview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errmsg = error.details.map(el => el.message).join(', ');
        throw new expresserr(400, errmsg);
    } else {
        next();
    }
}

module.exports.isauthor=async (req,res,next)=>{
    let {id,reviewid} = req.params;
    let review = await Review.findById(reviewid);
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You r not author.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

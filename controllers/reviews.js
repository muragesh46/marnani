const Review = require("../models/review");
const listing=require("../models/listing");

module.exports.showreview=async (req,res)=>{
    const {id} = req.params;
    let list = await listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    list.reviews.push(newReview._id);
    await newReview.save();
    await list.save();
    req.flash("success", "Review added successfully!");
    res.redirect(`/listings/${req.params.id}`);
}

module.exports.deletereview=async (req,res)=>{
    let {id,reviewId} = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);

}
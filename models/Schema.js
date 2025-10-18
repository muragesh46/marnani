const joi=require("joi");
module.exports.reviewSchema=joi.object({
    review:joi.object({
        rating:joi.required(),
        comment:joi.string().required(),
        author:joi.string().allow('').optional()
    }).required()
})
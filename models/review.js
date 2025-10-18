const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    comment:String,
    rating:{
        type:Number,
        min:0,
        max:5
    },
    created_at:{
        type:Date,
        default:Date.now,
    }
})
module.exports=mongoose.model('Review',reviewSchema);
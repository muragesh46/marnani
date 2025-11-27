const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const { reviewSchema } = require("./Schema");
const listingschema = new Schema({
    title: {
        type: String,
        required: true
    },

    place: {
        type: String, require: true
    },
    image: {
        filename: { type: String },
        url: {
            type: String,
            set: v => (v && v.trim() !== "" ? v : "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHViYWl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60")
        }
    },

    price: { type: Number },
    location: { type: String, required: true },
    description: String,

    country: {
        type: String,
        required: true
    },

     
    bedrooms: {
        type: Number,
        default: 1
    },
    beds: {
        type: Number,
        default: 1
    },
    maxGuests: {
        type: Number,
        default: 2
    },
    amenities: {
        type: [String],
        default: []
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }


});

listingschema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});
const Listing = mongoose.model('Listing', listingschema);
module.exports = Listing;
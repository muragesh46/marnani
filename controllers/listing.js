const listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const { sort, category, minPrice, maxPrice, location, checkIn, checkOut, bedrooms, beds, guests, amenities } = req.query;

     
    let filter = {};

     
    if (category && category !== 'all') {
        filter.category = category;
    }

     
    if (location && location.trim() !== '') {
        filter.$or = [
            { location: { $regex: location, $options: 'i' } },
            { country: { $regex: location, $options: 'i' } }
        ];
    }

     
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseInt(minPrice);
        if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

     
    if (bedrooms) {
        filter.bedrooms = { $gte: parseInt(bedrooms) };
    }

     
    if (beds) {
        filter.beds = { $gte: parseInt(beds) };
    }

     
    if (guests) {
        filter.maxGuests = { $gte: parseInt(guests) };
    }

     
    if (amenities) {
        const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities];
        filter.amenities = { $all: amenitiesArray };
    }

     
    let query = listing.find(filter).populate('reviews');

     
    if (sort === 'price-low') {
        query = query.sort({ price: 1 });
    } else if (sort === 'price-high') {
        query = query.sort({ price: -1 });
    } else if (sort === 'rating') {
         
        query = query.sort({ createdAt: -1 });
    } else {
         
        query = query.sort({ createdAt: -1 });
    }

    let alllistings = await query;

     
    if (sort === 'rating') {
        alllistings = alllistings.map(list => {
            let avgRating = 0;
            if (list.reviews && list.reviews.length > 0) {
                const sum = list.reviews.reduce((acc, r) => acc + r.rating, 0);
                avgRating = sum / list.reviews.length;
            }
            return { ...list.toObject(), avgRating };
        }).sort((a, b) => b.avgRating - a.avgRating);
    }

     
    res.render('index', {
        alllistings,
        filters: { location, checkIn, checkOut, bedrooms, beds, guests, amenities, minPrice, maxPrice }
    });
};



module.exports.newlisting = async (req, res) => {

    let newlisting = new listing(req.body.listing);
    newlisting.owner = req.user._id;

    if (req.file) {
        newlisting.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    console.log(newlisting);
    await newlisting.save();
    req.flash("success", "new listing added successfully.");
    res.redirect('/listings');

}

module.exports.showlisting = async (req, res) => {
    let { id } = req.params;

    const list = await listing.findById(id)
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate("owner");
    res.render('show', { list });
}

module.exports.editlisting = async (req, res) => {
    let { id } = req.params;

    const list = await listing.findById(id);
    res.render("edit", { list });
}

module.exports.updatelisting = async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success", "updated listing successfully.");
    res.redirect(`/listings/${id}`);
}
module.exports.deletelisting = async (req, res) => {
    let { id } = req.params;
    let deleted = await listing.findByIdAndDelete(id);
    console.log('deleted listing' + deleted);
    req.flash("deleted", " listing was deleted ");
    res.redirect('/listings');

}
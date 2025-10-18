const listing=require("../models/listing");

module.exports.index=async (req,res)=>{

    const alllistings= await listing.find({}).populate('reviews');
    res.render('index',{alllistings});
};


module.exports.newlisting=async (req,res)=>{

    let newlisting = new listing(req.body.listing);
    newlisting.owner=req.user._id;

    if(req.file){
        newlisting.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    console.log(newlisting);
    await newlisting.save();
    req.flash("success","new listing added successfully.");
    res.redirect('/listings');

}

module.exports.showlisting=async (req,res)=>{
    let {id} = req.params;

    const list=await listing.findById(id)
        .populate({path: 'reviews', populate: {path: 'author'}})
        .populate("owner");
    res.render('show',{list});
}

module.exports.editlisting= async (req,res)=>{
    let {id} = req.params;

    const list=await listing.findById(id);
    res.render("edit",{list});
}

module.exports.updatelisting=async (req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success","updated listing successfully.");
    res.redirect(`/listings/${id}`);
}
module.exports.deletelisting= async (req,res)=>{
    let {id} = req.params;
    let deleted = await listing.findByIdAndDelete(id);
    console.log('deleted listing'+deleted);
    req.flash("deleted"," listing was deleted ");
    res.redirect('/listings');

}
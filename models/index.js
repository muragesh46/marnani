var express = require('express');
var router = express.Router();
const listings = require("./listing");
const initdata = require("./data");
const mongoose = require("mongoose");
 

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/myapp');
}
main().then(()=> {
    console.log('connected to db');
}).catch(function (err) {
    console.log('error connecting to db', err);
})


const initdb=async () => {
    await listings.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"68ed3d2740fe5ea20b37609c"}))
    await listings.insertMany(initdata.data);
    console.log('successfully inserted data');
}

initdb();
module.exports = router;

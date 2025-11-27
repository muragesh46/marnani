require("dotenv").config();

const myurl = 'mongodb://127.0.0.1:27017/myapp';
const dburl = process.env.USE_LOCAL === 'true' ? myurl : process.env.ATLASMB;

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const expresserr = require("./public/javascripts/expresserr")
const MongoStore = require('connect-mongo');

const reviews = require("./routes/reviews");
const listings = require("./routes/listings");
const users = require("./routes/users");

const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");

const store = MongoStore.create({
    mongoUrl: dburl,
    touchAfter: 24 * 3600
})
store.on("error", function (err) {
    console.log(err);
})

const sessionoption = {
    store: store,
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
};

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));
app.engine("ejs", engine);
app.use(methodOverride("_method"));

app.use(session(sessionoption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const setFlashMessages = (req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.deleted = req.flash("deleted");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;

    next();
};

app.use(setFlashMessages);

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/user", users)

app.get('/', function (req, res) {
    res.send('Welcome to my website!');
});

mongoose.connect(dburl)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.all('*', (req, res, next) => {
    next(new expresserr(404, "Not Found"));
});

app.use((err, req, res, next) => {
    const { statuscode = 500, message = "Something went wrong" } = err;
    res.status(statuscode).render("error", { message, error: err });
});

app.listen(3000);

module.exports = app;
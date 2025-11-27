const User = require("../models/user");
const listing = require("../models/listing");

module.exports.showProfile = async (req, res) => {
    try {
         
        const userListings = await listing.find({ owner: req.user._id }).populate('reviews');

        res.render('users/profile', {
            user: req.user,
            userListings: userListings
        });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error loading profile');
        res.redirect('/listings');
    }
};

module.exports.updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const userId = req.user._id;

         
        if (username !== req.user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                req.flash('error', 'Username already taken');
                return res.redirect('/user/profile');
            }
        }

        await User.findByIdAndUpdate(userId, { username, email });
        req.flash('success', 'Profile updated successfully!');
        res.redirect('/user/profile');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error updating profile');
        res.redirect('/user/profile');
    }
};

module.exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            req.flash('error', 'New passwords do not match');
            return res.redirect('/user/profile');
        }

        if (newPassword.length < 6) {
            req.flash('error', 'Password must be at least 6 characters');
            return res.redirect('/user/profile');
        }

        const user = await User.findById(req.user._id);

         
        await user.changePassword(currentPassword, newPassword);

        req.flash('success', 'Password updated successfully!');
        res.redirect('/user/profile');
    } catch (err) {
        console.error(err);
        req.flash('error', err.message || 'Error updating password. Please check your current password.');
        res.redirect('/user/profile');
    }
};

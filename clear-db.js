require("dotenv").config();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const Review = require('./models/review');
const User = require('./models/user');

const dburl = process.env.USE_LOCAL === 'true' ? 'mongodb://127.0.0.1:27017/myapp' : process.env.ATLASMB;

async function clearDatabase() {
    try {
        console.log('🗑️  Connecting to MongoDB Atlas to CLEAR old data...');
        console.log('Database URL:', dburl.substring(0, 30) + '...');

        await mongoose.connect(dburl);
        console.log('✓ Connected to MongoDB Atlas\n');

        console.log('Deleting ALL existing data...');

        const deletedListings = await Listing.deleteMany({});
        console.log(`  ✓ Deleted ${deletedListings.deletedCount} listings`);

        const deletedReviews = await Review.deleteMany({});
        console.log(`  ✓ Deleted ${deletedReviews.deletedCount} reviews`);

        const deletedUsers = await User.deleteMany({});
        console.log(`  ✓ Deleted ${deletedUsers.deletedCount} users`);

        console.log('\n✅ Database completely cleared!');
        console.log('\nNow run: node seed.js');

    } catch (error) {
        console.error('❌ Error clearing database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n✓ Database connection closed');
    }
}

clearDatabase();

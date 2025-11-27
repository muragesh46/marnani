require("dotenv").config();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const Review = require('./models/review');
const User = require('./models/user');
const { data: sampleListings } = require('./models/data');

const dburl = process.env.USE_LOCAL === 'true' ? 'mongodb://127.0.0.1:27017/myapp' : process.env.ATLASMB;

const dummyUsers = [
    { username: 'john_doe', email: 'john@example.com', password: 'password123' },
    { username: 'jane_smith', email: 'jane@example.com', password: 'password123' },
    { username: 'mike_wilson', email: 'mike@example.com', password: 'password123' },
    { username: 'sarah_johnson', email: 'sarah@example.com', password: 'password123' },
    { username: 'david_brown', email: 'david@example.com', password: 'password123' },
    { username: 'emily_davis', email: 'emily@example.com', password: 'password123' },
    { username: 'alex_martinez', email: 'alex@example.com', password: 'password123' },
    { username: 'lisa_anderson', email: 'lisa@example.com', password: 'password123' }
];

const reviewComments = [
    "Amazing place! Highly recommended.",
    "Great location and wonderful amenities.",
    "Perfect for a family vacation.",
    "Beautiful property with stunning views.",
    "Very clean and comfortable.",
    "Host was very responsive and helpful.",
    "Would definitely stay here again!",
    "Exceeded all expectations.",
    "Peaceful and relaxing atmosphere.",
    "Excellent value for money.",
    "Wonderful experience from start to finish.",
    "The photos don't do it justice!",
    "Great place for a weekend getaway.",
    "Perfect spot for a romantic retreat.",
    "Loved every minute of our stay.",
    "Fantastic location near all attractions.",
    "Very well-maintained property.",
    "Host went above and beyond.",
    "Beautiful place with great character.",
    "Couldn't have asked for a better stay."
];

async function seedDatabase() {
    try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(dburl);
        console.log('✓ Connected to MongoDB Atlas');

        console.log('\nClearing existing data...');
        await Listing.deleteMany({});
        await Review.deleteMany({});
        await User.deleteMany({});
        console.log('✓ Cleared existing data');

        console.log('\nCreating dummy users...');
        const createdUsers = [];
        for (const userData of dummyUsers) {
            const user = new User({
                username: userData.username,
                email: userData.email
            });
            await User.register(user, userData.password);
            createdUsers.push(user);
            console.log(`  ✓ Created user: ${userData.username}`);
        }
        console.log(`✓ Created ${createdUsers.length} users`);

        console.log('\nCreating listings with reviews...');
        for (let i = 0; i < sampleListings.length; i++) {
            const listingData = sampleListings[i];
            const randomOwner = createdUsers[Math.floor(Math.random() * createdUsers.length)];

            const listing = new Listing({
                title: listingData.title,
                description: listingData.description,
                image: listingData.image,
                price: listingData.price,
                location: listingData.location,
                country: listingData.country,
                place: listingData.location,
                owner: randomOwner._id,
                bedrooms: Math.floor(Math.random() * 4) + 1,
                beds: Math.floor(Math.random() * 6) + 1,
                maxGuests: Math.floor(Math.random() * 8) + 2,
                amenities: ['WiFi', 'Kitchen', 'Free parking', 'Air conditioning'].slice(0, Math.floor(Math.random() * 4) + 1)
            });

            const numReviews = Math.floor(Math.random() * 5) + 3;

            for (let j = 0; j < numReviews; j++) {
                const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
                const randomComment = reviewComments[Math.floor(Math.random() * reviewComments.length)];
                const randomRating = Math.floor(Math.random() * 2) + 4;

                const review = new Review({
                    author: randomUser._id,
                    comment: randomComment,
                    rating: randomRating,
                    created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
                });

                await review.save();
                listing.reviews.push(review._id);
            }

            await listing.save();
            console.log(`  ✓ Created listing: ${listing.title} (${numReviews} reviews)`);
        }

        console.log(`\n✓ Successfully created ${sampleListings.length} listings`);

        const totalReviews = await Review.countDocuments();
        console.log(`✓ Total reviews created: ${totalReviews}`);

        console.log('\n✅ Database seeding completed successfully!');
        console.log(`\nSummary:`);
        console.log(`  Users: ${createdUsers.length}`);
        console.log(`  Listings: ${sampleListings.length}`);
        console.log(`  Reviews: ${totalReviews}`);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n✓ Database connection closed');
    }
}

seedDatabase();

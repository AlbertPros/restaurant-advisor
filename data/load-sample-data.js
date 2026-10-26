require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const MongooseRestaurantModel =
    require('../src/infrastructure/persistence/mongooseRestaurantModel');
const MongooseReviewModel =
    require('../src/infrastructure/persistence/mongooseReviewModel');
const MongooseUserModel =
    require('../src/infrastructure/persistence/mongooseUserModel');
const restaurants = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'restaurants.json'), 'utf-8')
);
const reviews = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'reviews.json'), 'utf-8')
);
const users = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'users.json'), 'utf-8')
);
async function connectDatabase() {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log('Connection to database established');
    } catch (err) {
        console.log(`Database connection error: ${err.message}`);
        process.exit(1);
    }
}
async function deleteData() {
    console.log('Deleting sample data');
    await MongooseReviewModel.deleteMany();
    await MongooseRestaurantModel.deleteMany();
    await MongooseUserModel.deleteMany();
    console.log('Sample data deleted');
    process.exit();
}
async function loadData() {
    try {
        await MongooseUserModel.insertMany(users);
        await MongooseRestaurantModel.insertMany(restaurants);
        await MongooseReviewModel.insertMany(reviews);
        console.log('Sample data loaded');
        process.exit();
    } catch (err) {
        console.log('\nError loading sample data.');
        console.log('If the database already contains sample data, delete it first with: \n');
        console.log('\tnpm run deletesample\n');
        console.log(err);
        process.exit(1);
    }
}
async function main() {
    await connectDatabase();
    if (process.argv.includes('--delete')) {
        await deleteData();
    } else {
        await loadData();
    }
}
main();
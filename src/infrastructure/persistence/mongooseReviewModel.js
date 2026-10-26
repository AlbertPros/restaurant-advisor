const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.ObjectId,
        ref: 'Restaurant',
        required: 'Review must belong to a restaurant'
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'Review must have an author'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: 'Review must have a rating'
    },
    text: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Review', reviewSchema);
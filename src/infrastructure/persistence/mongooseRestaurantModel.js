const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    tags: [String],
    photo: String,
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply an owner'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// TEXT INDEX
restaurantSchema.index({
    name: 'text',
    description: 'text'
});
module.exports = mongoose.model('Restaurant', restaurantSchema);
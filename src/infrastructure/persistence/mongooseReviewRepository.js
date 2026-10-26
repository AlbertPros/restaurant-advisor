const MongooseReviewModel = require('./mongooseReviewModel');
const { createReview } = require('../../domain/entities/review');
function toPersistence(review) {
    return {
        restaurant: review.restaurantId,
        author: review.userId,
        rating: review.rating,
        text: review.text,
        createdAt: review.createdAt
    };
}
function toDomain(document) {
    return createReview({
        id: document._id.toString(),
        restaurantId: document.restaurant.toString(),
        userId: document.author.toString(),
        rating: document.rating,
        text: document.text,
        createdAt: document.createdAt
    });
}
async function save(review) {
    const document = new MongooseReviewModel(toPersistence(review));
    const savedDocument = await document.save();
    return toDomain(savedDocument);
}
async function findByRestaurantId(restaurantId) {
    const documents = await MongooseReviewModel
        .find({ restaurant: restaurantId })
        .sort({ createdAt: -1 });
    return documents.map(toDomain);
}
module.exports = {
    save,
    findByRestaurantId
};
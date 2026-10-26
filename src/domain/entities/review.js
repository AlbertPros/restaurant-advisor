function createReview({
    id = null,
    restaurantId,
    userId,
    rating,
    text = '',
    createdAt = new Date()
}) {
    if (!restaurantId) {
        throw new Error('Review must belong to a restaurant');
    }
    if (!userId) {
        throw new Error('Review must have an author');
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new Error('Rating must be an integer between 1 and 5');
    }
    return {
        id,
        restaurantId,
        userId,
        rating,
        text,
        createdAt
    };
}
module.exports = {
    createReview
};
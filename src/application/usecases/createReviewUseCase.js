const { createReview } = require('../../domain/entities/review');
function createReviewUseCase(reviewRepository) {
    return {
        async execute({ restaurantId, userId, rating, text }) {
            const review = createReview({
                restaurantId,
                userId,
                rating,
                text
            });
            return reviewRepository.save(review);
        }
    };
}
module.exports = {
    createReviewUseCase
};
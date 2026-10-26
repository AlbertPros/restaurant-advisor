function createGetRestaurantWithReviewsUseCase(restaurantRepository, reviewRepository, userRepository) {
    return {
        async execute(restaurantId) {
            const restaurant = await
                restaurantRepository.findById(restaurantId);
            if (!restaurant) {
                return null;
            }
            const reviews = await
                reviewRepository.findByRestaurantId(restaurantId);
            const userIds = [
                ...new Set(reviews.map(review => review.userId))
            ];
            const users = await userRepository.findByIds(userIds);
            const usersById = new Map(
                users.map(user => [user.id, user])
            );
            const reviewsWithAuthorNames = reviews.map(review => ({
                ...review,
                authorName: usersById.get(review.userId)?.name ||
                    'Unknown user'
            }));
            return {
                restaurant,
                reviews: reviewsWithAuthorNames
            };
        }
    };
}
module.exports = { createGetRestaurantWithReviewsUseCase };
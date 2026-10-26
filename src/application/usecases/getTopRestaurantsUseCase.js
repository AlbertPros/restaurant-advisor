function createGetTopRestaurantsUseCase(restaurantRepository) {
    return {
        async execute(limit = 10) {
            return restaurantRepository.findTopRestaurantsByAverageRating(limit);
        }
    };
}
module.exports = { createGetTopRestaurantsUseCase };
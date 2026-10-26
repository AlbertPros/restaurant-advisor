function createSearchRestaurantsUseCase(restaurantRepository) {
    return {
        async execute(query, limit = 5) {
            if (!query || query.trim() === '') {
                return [];
            }
            return restaurantRepository.searchByText(query.trim(), limit);
        }
    }
};
module.exports = {
    createSearchRestaurantsUseCase
};
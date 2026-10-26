function createGetPaginatedRestaurantsUseCase(restaurantRepository) {
    return {
        async execute(page = 1, limit = 4) {
            return restaurantRepository.findPaginated(page, limit);
        }
    };
}
module.exports = { createGetPaginatedRestaurantsUseCase };
function createGetAllRestaurantsUseCase(restaurantRepository) {
    return {
        async execute() {
            return restaurantRepository.findAll();
        }
    };
}
module.exports = { createGetAllRestaurantsUseCase };
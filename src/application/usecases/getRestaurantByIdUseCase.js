function createGetRestaurantByIdUseCase(restaurantRepository) {
    return {
        async execute(id) {
            return restaurantRepository.findById(id);
        }
    };
}
module.exports = { 
    createGetRestaurantByIdUseCase 
};
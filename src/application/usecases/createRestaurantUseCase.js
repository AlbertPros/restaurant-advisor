const { createRestaurant } = require('../../domain/entities/restaurant');

function createRestaurantUseCase(restaurantRepository) {
    return {
        async execute(restaurantData) {
            const restaurant = createRestaurant(restaurantData);
            return restaurantRepository.save(restaurant);
        }
    };
};

module.exports = { createRestaurantUseCase };
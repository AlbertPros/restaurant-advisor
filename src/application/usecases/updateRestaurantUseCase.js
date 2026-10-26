const { createRestaurant } = require('../../domain/entities/restaurant');
function createUpdateRestaurantUseCase(restaurantRepository) {
    return {
        async execute(id, restaurantData, currentUserId) {
            const currentRestaurant = await
                restaurantRepository.findById(id);
            if (!currentRestaurant) {
                return null;
            }
            if (currentRestaurant.ownerId !== currentUserId) {
                throw new Error('You are not allowed to edit this restaurant');
}
            const restaurant = createRestaurant({
                ...currentRestaurant,
                ...restaurantData
            });
            return restaurantRepository.update(id, restaurant);
        }
    };
}
module.exports = { createUpdateRestaurantUseCase };
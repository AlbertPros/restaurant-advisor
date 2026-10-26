function createRestaurant({
    id = null,
    name,
    description = '',
    address = '',
    tags = [],
    photo = null,
    ownerId,
    createdAt = new Date()
}) {
    //business rule
    if (!ownerId) {
        throw new Error('Restaurant must have an owner');
    }
    return {
        id,
        name,
        description,
        address,
        tags,
        photo,
        ownerId,
        createdAt
    };
}
module.exports = { createRestaurant };
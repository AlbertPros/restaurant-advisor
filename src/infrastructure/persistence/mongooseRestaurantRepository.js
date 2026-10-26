const MongooseRestaurantModel = require('./mongooseRestaurantModel');
const { createRestaurant } = require('../../domain/entities/restaurant');

function toPersistence(restaurant) {
    return {
        name: restaurant.name,
        description: restaurant.description,
        address: restaurant.address,
        tags: restaurant.tags,
        photo: restaurant.photo,
        owner: restaurant.ownerId,
        createdAt: restaurant.createdAt
    };
}

function toDomain(document) {
    return createRestaurant({
        id: document._id.toString(),
        name: document.name,
        description: document.description,
        address: document.address,
        tags: document.tags,
        photo: document.photo,
        ownerId: document.owner.toString(),
        createdAt: document.createdAt
    });
}
async function save(restaurant) {
    const document = new MongooseRestaurantModel(
        toPersistence(restaurant)
    );
    await document.save(); // save the document in MongoDB
    return toDomain(document);
}
async function findById(id) {
    const document = await MongooseRestaurantModel.findById(id);
    if (!document) {
        return null;
    }
    return toDomain(document);
}
async function findAll() {
    const documents = await MongooseRestaurantModel.find();
    return documents.map(toDomain);
}
async function update(id, restaurant) {
    const document =
        await MongooseRestaurantModel.findByIdAndUpdate(
            id,
            toPersistence(restaurant),
            {
                returnDocument: 'after',
                runValidators: true
            }
        );
    if (!document) {
        return null;
    }
    return toDomain(document);
}
async function searchByText(query, limit = 5) {
    const documents = await MongooseRestaurantModel.find(
        { $text: { $search: query } },
        { score: { $meta: 'textScore' } }
    )
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit);
    return documents.map(toDomain);
}
async function findTopRestaurantsByAverageRating(limit = 10) {
    const results = await MongooseRestaurantModel.aggregate([
        {
            $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'restaurant',
                as: 'reviews'
            }
        },
        {
            $match: { 'reviews.1': { $exists: true } }
        },
        {
            $addFields: {
                averageRating: { $avg: '$reviews.rating' },
                reviewCount: { $size: '$reviews' }
            }
        },
        {
            $sort: { averageRating: -1 }
        },
        {
            $limit: limit
        }
    ]);

    return results.map(result => ({
        id: result._id.toString(),
        name: result.name,
        photo: result.photo,
        address: result.address,
        averageRating: result.averageRating,
        reviewCount: result.reviewCount
    }));
}
async function findPaginated(page = 1, limit = 4) {
    const skip = (page * limit) - limit;
    const restaurantsPromise = MongooseRestaurantModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: 'desc' });
    const countPromise = MongooseRestaurantModel.countDocuments();
    const [documents, count] = await Promise.all([
        restaurantsPromise,
        countPromise
    ]);
    const pages = Math.ceil(count / limit);
    return {
        restaurants: documents.map(toDomain),
        count,
        pages
    };
}
module.exports = {
    save,
    findById,
    findAll,
    update,
    searchByText,
    findTopRestaurantsByAverageRating,
    findPaginated
};
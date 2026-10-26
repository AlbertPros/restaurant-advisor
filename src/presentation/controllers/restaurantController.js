const fileUploadMiddleware = require('../middleware/fileUploadMiddleware');
const { addFlash } = require('../flash/flashMessages');

function createRestaurantController(restaurantCreationUseCase, getRestaurantByIdUseCase, getRestaurantWithReviewsUseCase, getAllRestaurantsUseCase, updateRestaurantUseCase, searchRestaurantsUseCase, getTopRestaurantsUseCase, getPaginatedRestaurantsUseCase) {
    return {
        showCreateForm(req, res) {
            res.render('editRestaurant', { title: 'Add Restaurant' });
        },
        async create(req, res, next) {
            try {
                const imageFilename = await
                    fileUploadMiddleware.resizeAndSaveImage(req);
                const restaurantData = {
                    name: req.body.name,
                    description: req.body.description,
                    address: req.body.address,
                    tags: req.body.tags,
                    photo: imageFilename,
                    ownerId: req.user.id
                };
                const savedRestaurant =
                    await
                        restaurantCreationUseCase.execute(restaurantData);
                addFlash(req, 'success', 'Restaurant created successfully.');
                res.redirect(`/restaurants/${savedRestaurant.id}`);
            } catch (err) {
                next(err);
            }
        },
        async showOne(req, res, next) {
            try {
                const result = await
                    getRestaurantWithReviewsUseCase.execute(req.params.id);
                if (!result.restaurant) {
                    const err = new Error('Restaurant not found');
                    err.status = 404;
                    return next(err);
                }
                res.render('restaurant', {
                    title: result.restaurant.name,
                    restaurant: result.restaurant,
                    reviews: result.reviews
                });
            } catch (err) {
                next(err);
            }
        },
        async showAll(req, res, next) {
            try {
                const restaurants =
                    await getAllRestaurantsUseCase.execute();
                res.render('restaurants', {
                    title: 'Restaurants',
                    restaurants
                });
            } catch (err) {
                next(err);
            }
        },
        async showEditForm(req, res, next) {
            try {
                const restaurant = await
                    getRestaurantByIdUseCase.execute(req.params.id);
                if (!restaurant) {
                    const err = new Error('Restaurant not found');
                    err.status = 404;
                    return next(err);
                }
                res.render('editRestaurant', {
                    title: 'Edit Restaurant',
                    restaurant
                });
            } catch (err) {
                next(err);
            }
        },
        async update(req, res, next) {
            try {
                const imageFilename = await
                    fileUploadMiddleware.resizeAndSaveImage(req);
                const restaurantData = {
                    name: req.body.name,
                    description: req.body.description,
                    address: req.body.address,
                    tags: req.body.tags,
                };
                if (imageFilename) {
                    restaurantData.photo = imageFilename;
                }
                const updatedRestaurant =
                    await updateRestaurantUseCase.execute(
                        req.params.id,
                        restaurantData,
                        req.user.id
                    );
                if (!updatedRestaurant) {
                    const err = new Error('Restaurant not found');
                    err.status = 404;
                    return next(err);
                }
                addFlash(req, 'success', 'Restaurant updated successfully.');
                res.redirect(`/restaurants/${updatedRestaurant.id}`);
            } catch (err) {
                next(err);
            }
        },
        async searchRestaurantsApi(req, res, next) {
            try {
                const restaurants = await
                    searchRestaurantsUseCase.execute(req.query.q);
                res.json({
                    restaurants,
                    length: restaurants.length
                });
            } catch (err) {
                next(err);
            }
        },
        async top(req, res, next) {
            try {
                const restaurants = await getTopRestaurantsUseCase.execute(10);
                res.render('topRestaurants', {
                    title: 'Top Restaurants',
                    restaurants
                });
            } catch (err) {
                next(err);
            }
        },
        async list(req, res, next) {
            try {
                const page = Number(req.params.page || 1);
                const limit = 3;
                const { restaurants, count, pages } =
                    await getPaginatedRestaurantsUseCase.execute(page, limit);
                if (page > pages && count > 0) {
                    addFlash(req, 'info', `You asked for page ${page}, which does not exist. Redirected to page ${pages}.`);
                    return res.redirect(`/restaurants/page/${pages}`);
                }
                return res.render('restaurants', {
                    title: 'Restaurants',
                    restaurants,
                    page,
                    pages,
                    count
                });
            } catch (err) {
                return next(err);
            }
        }
    };
}

module.exports = {
    createRestaurantController
};
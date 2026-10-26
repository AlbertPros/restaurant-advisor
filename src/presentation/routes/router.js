const express = require('express');
const fileUploadMiddleware =
    require('../middleware/fileUploadMiddleware');
const { registerValidators, resetPasswordValidators,
    handleValidationErrors } =
    require('../middleware/userValidationMiddleware');
const { requireAuthentication } =
    require('../middleware/authenticationMiddleware');

function createRouter(homeController, restaurantController, userController, authController, reviewController) {
    const router = express.Router();
    router.get('/', homeController.showHomePage);
    router.get('/test-flash', homeController.testFlash);
    router.get('/restaurants/new',
        requireAuthentication,
        restaurantController.showCreateForm);
    router.post('/restaurants',
        requireAuthentication,
        fileUploadMiddleware.uploadPhoto,
        restaurantController.create
    );
    router.get('/restaurants/top', restaurantController.top);
    router.get('/restaurants/:id', restaurantController.showOne);
    router.get('/restaurants', restaurantController.showAll);
    router.get('/restaurants/:id/edit', restaurantController.showEditForm);
    router.post('/restaurants/:id', fileUploadMiddleware.uploadPhoto, restaurantController.update);
    router.get('/api/v1/restaurants/search', restaurantController.searchRestaurantsApi);
    router.get('/register', userController.showRegistrationForm);
    router.post('/register',
        registerValidators(),
        handleValidationErrors,
        userController.registerUser
    );
    router.get('/login', authController.showLoginForm);
    router.post('/login', authController.loginUser);
    router.get('/logout', authController.logoutUser);
    router.get('/account', userController.showAccount);
    router.get('/account',
        requireAuthentication,
        userController.showAccount
    );
    router.post(
        '/account',
        requireAuthentication,
        userController.updateAccount
    );
    router.post('/restaurants/:id/reviews',
        requireAuthentication,
        reviewController.create
    );
    router.post('/account/forgot', authController.forgot);
    router.get('/account/reset/:token', authController.showResetForm);
    router.post(
        '/account/reset/:token',
        resetPasswordValidators(),
        handleValidationErrors,
        authController.updatePassword
    );
    router.get('/restaurants/page/:page', restaurantController.list);
    return router;
}
module.exports = {
    createRouter
};
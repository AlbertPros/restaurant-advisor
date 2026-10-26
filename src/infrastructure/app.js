const express = require('express');

const path = require('path');

const mongooseRestaurantRepository =
    require('./persistence/mongooseRestaurantRepository');

const mongooseUserRepository =
    require('./persistence/mongooseUserRepository');

const mongooseReviewRepository =
    require('./persistence/mongooseReviewRepository');

const tokenGenerator = require('./security/cryptoTokenGenerator');
const tokenHasher = require('./security/sha256TokenHasher');
const emailSender = require('./email/nodemailerEmailSender');

const { createVerifyResetTokenUseCase } =
    require('../application/usecases/verifyResetTokenUseCase');

const { createResetPasswordUseCase } =
    require('../application/usecases/resetPasswordUseCase');

const { createRestaurantUseCase } =
    require('../application/usecases/createRestaurantUseCase');

const { createGetRestaurantByIdUseCase } =
    require('../application/usecases/getRestaurantByIdUseCase');

const { createGetRestaurantWithReviewsUseCase } =
    require('../application/usecases/getRestaurantWithReviewsUseCase');

const { createRouter } = require('../presentation/routes/router');

const { createGetPaginatedRestaurantsUseCase } =
    require('../application/usecases/getPaginatedRestaurantsUseCase');

const homeController =
    require('../presentation/controllers/homeController');

const { createRestaurantController } =
    require('../presentation/controllers/restaurantController');

const { createGetAllRestaurantsUseCase } =
    require('../application/usecases/getAllRestaurantsUseCase');

const { createUpdateRestaurantUseCase } =
    require('../application/usecases/updateRestaurantUseCase');

const { createSearchRestaurantsUseCase } =
    require('../application/usecases/searchRestaurantsUseCase');

const { createUserUseCase } =
    require('../application/usecases/createUserUseCase');

const { createReviewUseCase } =
    require('../application/usecases/createReviewUseCase');

const { createReviewController } =
    require('../presentation/controllers/reviewController');

const { createUserController } =
    require('../presentation/controllers/userController');

const passport = require('passport');

const { configurePassport } =
    require('./auth/passportConfig');

const { createAuthController } =
    require('../presentation/controllers/authController');

const utils = require('../presentation/utils');

const { getMenuForRole } =
    require('../presentation/config/menu');

const { createSessionMiddleware } =
    require('./middleware/sessionMiddleware');

const { createLocalsMiddleware } =
    require('../presentation/middleware/localsMiddleware');

const { flashMiddleware } =
    require('../presentation/middleware/flashMiddleware');

const errorHandlers =
    require('./errors/errorHandlers');

const { createUpdateAccountUseCase } =
    require('../application/usecases/updateAccountUseCase');

const { createGetTopRestaurantsUseCase } =
    require('../application/usecases/getTopRestaurantsUseCase');

const { createRequestPasswordResetUseCase } =
    require('../application/usecases/requestPasswordResetUseCase');

// Create Express application

const app = express();

// Component Wiring (Dependency Injection)

const userCreationUseCase =
    createUserUseCase(mongooseUserRepository);

const restaurantCreationUseCase =
    createRestaurantUseCase(mongooseRestaurantRepository);

const getRestaurantByIdUseCase =
    createGetRestaurantByIdUseCase(mongooseRestaurantRepository);

const getAllRestaurantsUseCase =
    createGetAllRestaurantsUseCase(mongooseRestaurantRepository);

const updateRestaurantUseCase =
    createUpdateRestaurantUseCase(mongooseRestaurantRepository);

const searchRestaurantsUseCase =
    createSearchRestaurantsUseCase(mongooseRestaurantRepository);

const updateAccountUseCase =
    createUpdateAccountUseCase(mongooseUserRepository);

const reviewCreationUseCase =
    createReviewUseCase(mongooseReviewRepository);

const getTopRestaurantsUseCase =
    createGetTopRestaurantsUseCase(mongooseRestaurantRepository);

const requestPasswordResetUseCase =
    createRequestPasswordResetUseCase(
        mongooseUserRepository,
        tokenGenerator,
        tokenHasher,
        emailSender
    );
const verifyResetTokenUseCase =
    createVerifyResetTokenUseCase(
        mongooseUserRepository,
        tokenHasher
    );
const resetPasswordUseCase =
    createResetPasswordUseCase(
        mongooseUserRepository,
        tokenHasher
    );
const getPaginatedRestaurantsUseCase =
    createGetPaginatedRestaurantsUseCase(mongooseRestaurantRepository);

const authController = createAuthController(requestPasswordResetUseCase, verifyResetTokenUseCase, resetPasswordUseCase);

const userController = createUserController(
    userCreationUseCase,
    updateAccountUseCase
);

const getRestaurantWithReviewsUseCase =
    createGetRestaurantWithReviewsUseCase(
        mongooseRestaurantRepository,
        mongooseReviewRepository,
        mongooseUserRepository
    );

const restaurantController = createRestaurantController(
    restaurantCreationUseCase,
    getRestaurantByIdUseCase,
    getRestaurantWithReviewsUseCase,
    getAllRestaurantsUseCase,
    updateRestaurantUseCase,
    searchRestaurantsUseCase,
    getTopRestaurantsUseCase,
    getPaginatedRestaurantsUseCase
);

const reviewController = createReviewController(
    reviewCreationUseCase
);


const router = createRouter(
    homeController,
    restaurantController,
    userController,
    authController,
    reviewController
);

// serves up static files from the public folder.

app.use(express.static(path.join(__dirname, '../presentation/public')));

//View engine

app.set('views', path.join(__dirname, '../presentation/views'));

app.set('view engine', 'pug');

//request body parsing -> creates the "req.body" object

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//session middleware

app.use(
    createSessionMiddleware({
        sessionKey: process.env.SESSION_KEY,
        sessionSecret: process.env.SESSION_SECRET,
        databaseUrl: process.env.DATABASE
    })
);

// Passport

configurePassport(mongooseUserRepository);

app.use(passport.initialize());

app.use(passport.session());

//locals middleware

app.use(createLocalsMiddleware(utils, getMenuForRole));

//flash middleware

app.use(flashMiddleware);

//Route registration

app.use('/', router);

//If no route matched

app.use(errorHandlers.notFound);

// Error handling pipeline

if (app.get('env') === 'development') {
    app.use(errorHandlers.developmentErrors);
}

app.use(errorHandlers.productionErrors);

// Single export -> export directly and import directly 

// Multiple exports -> export object and import with destructuring

module.exports = app;
const session = require('express-session');
const MongoStore = require('connect-mongo').default;

function createSessionMiddleware(config) {
    return session({
        name: config.sessionKey,
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: config.databaseUrl
        })
    });
}
module.exports = {
    createSessionMiddleware
};
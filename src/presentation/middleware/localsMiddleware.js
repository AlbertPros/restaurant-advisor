function createLocalsMiddleware(utils, getMenuForRole) {
    return (req, res, next) => {
        res.locals.utils = utils;
        res.locals.user = req.user || null;
        res.locals.menu = getMenuForRole('user');
        res.locals.currentPath = req.path;

        next();
    };
}

module.exports = {
    createLocalsMiddleware
};
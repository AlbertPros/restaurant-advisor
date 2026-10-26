function flashMiddleware(req, res, next) {
    res.locals.flashes = req.session.flashes || [];
    delete req.session.flashes;
    next();
}
module.exports = {
    flashMiddleware
};
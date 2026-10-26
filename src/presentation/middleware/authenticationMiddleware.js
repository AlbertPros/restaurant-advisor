const { addFlash } = require('../flash/flashMessages');

function requireAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    addFlash(req, 'error', 'You must be logged in to access this page');
    res.redirect('/login');
}
module.exports = {
    requireAuthentication
};
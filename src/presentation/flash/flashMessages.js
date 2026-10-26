function addFlash (req, type, message) {
    if (!Array.isArray(req.session.flashes)) {
        req.session.flashes = [];
    }
    req.session.flashes.push({ type, message });
};
module.exports = {
addFlash
};
const { addFlash } = require('../flash/flashMessages');

function showHomePage(req, res) {
    res.render('home', {
        title: 'Restaurant Advisor'
    });
};

module.exports = {
    showHomePage
};

function testFlash(req, res) {
    addFlash(req, 'success', 'Flash message');
    addFlash(req, 'error', 'Flash message');
    addFlash(req, 'warning', 'Flash message');
    addFlash(req, 'info', 'Flash message');
    res.redirect('/');
};
module.exports = {
    showHomePage,
    testFlash
};
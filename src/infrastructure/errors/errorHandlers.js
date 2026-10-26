function notFound(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
}

function developmentErrors(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
    status: err.status || 500,
    message: err.message,
    stack: err.stack
    });
}

function productionErrors(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
    status: err.status || 500,
    message: err.message,
    stack: null
    });
}
module.exports = {
    notFound,
    developmentErrors,
    productionErrors
};
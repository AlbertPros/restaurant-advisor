const { body, validationResult } = require('express-validator');
function registerValidators() {
    return [
        body('name', 'Name is required')
            .notEmpty()
            .trim(),
        body('email', 'Email is not valid')
            .isEmail()
            .normalizeEmail(),
        body('password', 'Password is required')
            .notEmpty(),
        body('passwordConfirm')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Password confirmation does not match');
                }
                return true;
            })
    ];
}
function resetPasswordValidators() {
    return [
        body('password', 'Password is required')
            .notEmpty(),
        body('passwordConfirm')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Password confirmation does not match');
                }
                return true;
            })
    ];
}
function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.validationErrors = errors.array().map(error => error.msg);
    }
    next();
}
module.exports = {
    registerValidators,
    resetPasswordValidators, 
    handleValidationErrors
};
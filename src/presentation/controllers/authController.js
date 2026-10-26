const passport = require('passport');
const { addFlash } = require('../flash/flashMessages');
function createAuthController(requestPasswordResetUseCase, verifyResetTokenUseCase, resetPasswordUseCase) {
    return {
        showLoginForm(req, res) {
            res.render('login', {
                title: 'Login'
            });
        },
        loginUser(req, res, next) {
            passport.authenticate('local', (error, user, info) => {
                if (error) {
                    return next(error);
                }
                if (!user) {
                    addFlash(
                        req,
                        'error',
                        info?.message || 'Invalid credentials'
                    );
                    return res.redirect('/login');
                }
                req.login(user, error => {
                    if (error) {
                        return next(error);
                    }
                    addFlash(req, 'success', 'You are now logged in');
                    return res.redirect('/restaurants');
                });
            })(req, res, next);
        },
        logoutUser(req, res, next) {
            req.logout(error => {
                if (error) {
                    return next(error);
                }
                addFlash(req, 'success', 'You are now logged out');
                res.redirect('/restaurants');
            });
        },
        async forgot(req, res, next) {
            try {
                await requestPasswordResetUseCase.execute(
                    req.body.email,
                    `${req.protocol}://${req.get('host')}`
                );
                addFlash(req, 'success', 'If that email exists, we have sent a reset link');
                return res.redirect('/login');
            } catch (err) {
                return next(err);
            }
        },
        async showResetForm(req, res, next) {
            try {
                const user = await
                    verifyResetTokenUseCase.execute(req.params.token);
                if (!user) {
                    addFlash(req, 'error', 'Password reset is invalid or has expired');
                    return res.redirect('/login');
                }
                return res.render('reset', {
                    title: 'Reset your password',
                });
            } catch (err) {
                return next(err);
            }
        },
        async updatePassword(req, res, next) {
            try {
                if (req.validationErrors?.length) {
                    req.validationErrors.forEach(message =>
                        addFlash(req, 'error', message)
                    );
                    return res.redirect(`/account/reset/${req.params.token}`
                    );
                }
                const user = await resetPasswordUseCase.execute(
                    req.params.token,
                    req.body.password
                );
                if (!user) {
                    addFlash(req, 'error', 'Password reset is invalid or has expired');
                    return res.redirect('/login');
                }
                addFlash(req, 'success', 'Your password has been reset');
                return res.redirect('/login');
            } catch (err) {
                return next(err);
            }
        }
    };
}
module.exports = {
    createAuthController
};
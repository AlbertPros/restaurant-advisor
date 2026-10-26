const { addFlash } = require('../flash/flashMessages');

function createUserController(userCreationUseCase, updateAccountUseCase) {
    return {
        showRegistrationForm(req, res) {
            res.render('register', {
                title: 'Register'
            });
        },

        async registerUser(req, res, next) {
            try {
                if (req.validationErrors?.length) {
                    req.validationErrors.forEach(message => {
                        addFlash(req, 'error', message);
                    });
                    return res.render('register', {
                        title: 'Register',
                        body: req.body
                    });
                }
                await userCreationUseCase.execute({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
                addFlash(req, 'success', 'Your account has been created. You can now log in.');
                res.redirect('/login');
            } catch (error) {
                next(error);
            }
        },

        showAccount(req, res) {
            res.render('account', {
                title: 'Account'
            });
        },

        async updateAccount(req, res, next) {
            try {
                await updateAccountUseCase.execute({
                    userId: req.user.id,
                    name: req.body.name,
                    email: req.body.email
                });
                addFlash(req, 'success', 'Your account has been updated');
                res.redirect('/account');
            } catch (error) {
                next(error);
            }
        }
    };
}
module.exports = {
    createUserController
};
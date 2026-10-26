const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
function configurePassport(userRepository) {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email'
            },
            async (email, password, done) => {
                try {
                    const user =
                        await userRepository.findByEmail(email);
                    if (!user) {
                        return done(
                            null,
                            false,
                            { message: 'Invalid credentials' }
                        );
                    }
                    const passwordMatches =
                        await bcrypt.compare(
                            password,
                            user.passwordHash
                        );
                    if (!passwordMatches) {
                        return done(
                            null,
                            false,
                            { message: 'Invalid credentials' }
                        );
                    }
                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser(
        async (id, done) => {
            try {
                const user =
                    await userRepository.findById(id);
                done(null, user);
            } catch (error) {
                done(error);
            }
        }
    );
}
module.exports = {
    configurePassport
};
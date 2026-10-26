const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
function createResetPasswordUseCase(
    userRepository,
    tokenHasher
) {
    return {
        async execute(token, newPassword) {
            const tokenHash = tokenHasher.hash(token);
            const user = await
                userRepository.findByPasswordResetTokenHash(tokenHash);
            if (!user) {
                return null;
            }
            if (!user.passwordResetExpiresAt ||
                user.passwordResetExpiresAt < new Date()) {
                return null;
            }
            user.passwordHash = await bcrypt.hash(newPassword,
                SALT_ROUNDS);
            user.passwordResetTokenHash = null;
            user.passwordResetExpiresAt = null;
            return userRepository.update(user.id, user);
        }
    };
}
module.exports = { createResetPasswordUseCase };
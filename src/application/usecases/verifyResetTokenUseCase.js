function createVerifyResetTokenUseCase(
    userRepository,
    tokenHasher
) {
    return {
        async execute(token) {
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
            return user;
        }
    };
}
module.exports = {
    createVerifyResetTokenUseCase
};
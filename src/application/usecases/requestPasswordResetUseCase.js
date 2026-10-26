function createRequestPasswordResetUseCase(
    userRepository,
    tokenGenerator,
    tokenHasher,
    emailSender
) {
    return {
        async execute(email, baseURL) {
            const user = await userRepository.findByEmail(email);
            // Always return successfully, even if the user does not exist
            if (!user) {
                return;
            }
            const token = tokenGenerator.generate();
            user.passwordResetTokenHash = tokenHasher.hash(token);
            // Token expires in one hour
            user.passwordResetExpiresAt = new Date(Date.now() + (60 * 60* 1000));
            await userRepository.update(user.id, user);
            const resetURL = `${baseURL}/account/reset/${token}`;
            await emailSender.send({
                to: user.email,
                subject: 'Password Reset',
                template: 'password-reset',
                templateData: {
                    resetURL
                }
            });
        }
    };
}
module.exports = {
    createRequestPasswordResetUseCase
};
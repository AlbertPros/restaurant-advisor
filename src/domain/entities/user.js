function createUser({
    id = null,
    name = '',
    email = '',
    passwordHash = '',
    passwordResetTokenHash = null,
    passwordResetExpiresAt = null,
    createdAt = new Date()
}) {
    return {
        id,
        name,
        email,
        passwordHash,
        passwordResetTokenHash,
        passwordResetExpiresAt,
        createdAt
    };
}
module.exports = {
    createUser
};
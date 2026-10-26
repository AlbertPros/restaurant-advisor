const { createUser } = require('../../domain/entities/user');
function createUpdateAccountUseCase(userRepository) {
    return {
        async execute({ userId, name, email }) {
            const currentUser = await userRepository.findById(userId);
            if (!currentUser) {
                throw new Error('User not found');
            }
            const updatedUser = createUser({
                ...currentUser,
                name,
                email
            });
            return userRepository.update(userId, updatedUser);
        }
    };
}
module.exports = { createUpdateAccountUseCase };
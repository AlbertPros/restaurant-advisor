const bcrypt = require('bcrypt')
const { createUser } = require('../../domain/entities/user');
const SALT_ROUNDS = 10;
function createUserUseCase(userRepository) {
    return {
        async execute({ name, email, password }) {
            const existingUser = await userRepository.findByEmail(email);
            if (existingUser) {
                throw new Error('There is already a user with this email');
 }
            const passwordHash = await bcrypt.hash(password,
                SALT_ROUNDS);
            const user = createUser({ name, email, passwordHash });
            return userRepository.save(user);
        }
    };
}
module.exports = { createUserUseCase };
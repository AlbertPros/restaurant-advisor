const { createUser } = require('../../domain/entities/user');
const MongooseUserModel = require('./mongooseUserModel');
function toDomain(userDocument) {
    if (!userDocument) {
        return null;
    }
    return createUser({
        id: userDocument._id.toString(),
        name: userDocument.name,
        email: userDocument.email,
        passwordHash: userDocument.passwordHash,
        passwordResetTokenHash: userDocument.passwordResetTokenHash,
        passwordResetExpiresAt: userDocument.passwordResetExpiresAt,
        createdAt: userDocument.createdAt
    });
}
function toPersistence(user) {
    return {
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
        passwordResetTokenHash: user.passwordResetTokenHash,
        passwordResetExpiresAt: user.passwordResetExpiresAt,
        createdAt: user.createdAt
    };
}
async function save(user) {
    const userDocument = new MongooseUserModel(toPersistence(user));
    const savedUser = await userDocument.save();
    return toDomain(savedUser);
}
async function findByEmail(email) {
    const userDocument = await MongooseUserModel.findOne({
        email: email.toLowerCase().trim()
    });
    return toDomain(userDocument);
}
async function findById(id) {
    const userDocument = await MongooseUserModel.findById(id);
    return toDomain(userDocument);
}
async function update(id, user) {
    const document =
        await MongooseUserModel.findByIdAndUpdate(
            id,
            toPersistence(user),
            {
                returnDocument: 'after',
                runValidators: true
            }
        );
    if (!document) {
        return null;
    }
    return toDomain(document);
}
async function findByIds(ids) {
    const documents = await MongooseUserModel.find({
        _id: { $in: ids }
    });
    return documents.map(toDomain);
}
async function findByPasswordResetTokenHash(tokenHash) {
    const document = await MongooseUserModel.findOne({
        passwordResetTokenHash: tokenHash
    });
    if (!document) {
        return null;
    }
    return toDomain(document);
}
module.exports = {
    save,
    findByEmail,
    findById,
    update,
    findByIds,
    findByPasswordResetTokenHash
};
const userModel = require("../models/user.model");

module.exports.createUser = async ({
    firstname, lastname, email, password, profilePicture, profilePicPublicId
}) => {
    if (!firstname || !email || !password) {
        throw new Error("All fields are required");
    }

    const user = await userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        profilePicture: profilePicture || '',
        profilePicPublicId: profilePicPublicId || ''
    });

    return user;
};
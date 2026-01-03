const captainModel = require('../models/captain.model');

module.exports.createCaptain = async ({
    firstname, lastname, email, password, color, plate, capacity, vehicleType, 
    profilePicture, profilePicPublicId,
    // Also accept nested format from controller
    fullname, vehicle
}) => {
    // Support both flat and nested formats
    const fn = firstname || fullname?.firstname;
    const ln = lastname || fullname?.lastname;
    const vColor = color || vehicle?.color;
    const vPlate = plate || vehicle?.plate;
    const vCapacity = capacity || vehicle?.capacity;
    const vType = vehicleType || vehicle?.vehicleType;

    // Validation
    if (!fn || !ln || !email || !password || !vColor || !vPlate || !vCapacity || !vType) {
        throw new Error("All fields are required");
    }

    const captain = await captainModel.create({
        fullname: {
            firstname: fn,
            lastname: ln
        },
        email,
        password,
        vehicle: {
            color: vColor,
            plate: vPlate,
            capacity: vCapacity,
            vehicleType: vType
        },
        profilePicture: profilePicture || undefined,
        profilePicPublicId: profilePicPublicId || undefined
    });

    return captain;
};
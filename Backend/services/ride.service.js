const rideModel = require('../models/ride.model');
const mapService = require('../services/maps.service');
const crypto = require('crypto');
const { sendMessageToSocketId } = require('../socket');


async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error("Pickup and destination are required");
    }
    const distanceTime = await mapService.getDistanceTime(pickup, destination)
    const baseFare = {
        auto: 30,
        car: 50,
        moto: 20
    };

    const farePerKm = {
        auto: 10,
        car: 15,
        moto: 8
    };

    const farePerMinute = {
        auto: 2,
        car: 3,
        moto: 1.5
    };

    const fare = {
        auto: Math.round(baseFare.auto + (farePerKm.auto * (distanceTime.distance.value / 1000)) + (farePerMinute.auto * (distanceTime.duration.value / 60))),
        car: Math.round(baseFare.car + (farePerKm.car * (distanceTime.distance.value / 1000)) + (farePerMinute.car * (distanceTime.duration.value / 60))),
        moto: Math.round(baseFare.moto + (farePerKm.moto * (distanceTime.distance.value / 1000)) + (farePerMinute.moto * (distanceTime.duration.value / 60)))
    };

    return fare;


}

module.exports.getFare = getFare;

function generateOTP(num) {
    if (!num || num <= 0) {
        throw new Error("Number of digits must be greater than zero");
    }
    const otp = crypto.randomInt(0, Math.pow(10, num)).toString().padStart(num, '0');
    return otp;
}

module.exports.createRide = async ({ user, pickup, destination, vehicleType, paymentMode, otp }) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error("User, pickup, destination and vehicleType are required");
    }

    const fare = await getFare(pickup, destination);
    const ride = rideModel.create({
        user,
        pickup,
        destination,
        otp: generateOTP(6),
        fare: fare[vehicleType],
        paymentMode: paymentMode || 'Cash'
    })

    return ride;
}

module.exports.confirmRide = async ({ rideId, captain }) => {
    console.log("in service", { rideId, captain })
    if (!rideId || !captain) {
        throw new Error("Ride and captain are required");
    }

    await rideModel.findOneAndUpdate({
        _id: rideId,
    }, {
        status: "accepted",
        captain: captain
    })

    const ride = await rideModel.findOne({ _id: rideId }).populate("user").populate("captain").select('+otp');

    if (!ride) {
        throw new Error("Ride not found");
    }

    return ride;
}

module.exports.startRide = async ({ rideId, otp, captain }) => {
    if (!rideId || !otp) {
        throw new Error("Ride id and OTP are required")
    }

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp')

    if (!ride) {
        throw new Error("Ride not found")
    }

    if (ride.status !== "accepted") {
        throw new Error("Ride not accepted")
    }

    if (ride.otp !== otp) {
        throw new Error('Invalid OTP')
    }

    // ✅ Add { new: true } to get the UPDATED document
    const updatedRide = await rideModel.findOneAndUpdate(
        { _id: rideId },
        { status: 'ongoing' },
        { new: true }
    ).populate('user').populate('captain').select('+otp')

    sendMessageToSocketId(updatedRide.user.socketId, {
        event: "ride-started",
        data: updatedRide
    })

    return updatedRide;
}

module.exports.endRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error("Ride id is required")
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain');

    if (!ride) {
        throw new Error("Ride not found")
    }

    if (ride.status !== 'ongoing') {
        throw new Error("Ride is not ongoing")
    }

    // Update ride status to completed and ensure payment status is updated if it's a cash ride
    const updatedRide = await rideModel.findOneAndUpdate(
        { _id: rideId },
        {
            status: 'completed',
            paymentStatus: 'paid' // Safety fallback to ensure it's marked as paid when ride ends
        },
        { new: true }
    ).populate('user').populate('captain');

    // Update captain's stats
    const captainModel = require('../models/captain.model');
    const captainDoc = await captainModel.findById(captain._id);

    if (captainDoc) {
        await captainDoc.incrementTodayRideCount();
        await captainDoc.updateEarnings(ride.fare);
    }

    return updatedRide;
}

const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');
const stripeService = require("../services/stripe.service")

module.exports.createRide = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { pickup, destination, vehicleType } = req.body;

    try {
        const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
        res.status(201).json(ride)
        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);

        const captainInRadius = await mapService.getCaptainInTheRedius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);
        ride.otp = ""
        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate("user")
        captainInRadius.map(captain => {
            sendMessageToSocketId(captain.socketId, {
                event: "new-ride",
                data: rideWithUser

            })
        })
    } catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({ message: "Error creating ride", error: error.message })
    }

}


module.exports.getFare = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { pickup, destination } = req.query;
    try {
        const fare = await rideService.getFare(pickup, destination);
        res.status(200).json(fare);
    } catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({ message: "Error fetching fare", error: error.message })
    }
}

module.exports.confirmRide = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { rideId, captainId } = req.body;
    console.log("in controller", req.body)

    try {
        const ride = await rideService.confirmRide({ rideId, captain: captainId });


        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })
        return res.status(200).json(ride);
    }
    catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({ message: "Error confirming ride", error: error.message })
    }
}

module.exports.startRide = async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { rideId, otp } = req.query

    try {
        const ride = await rideService.startRide({
            rideId, otp, captain: req.captain
        })

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride)

    } catch (error) {
        return res.status(500).json({ message: error.array() })
    }
}


module.exports.endRide = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { rideId } = req.body

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain })

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })


        return res.status(200).json(ride)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }


}

module.exports.createPaymentIntent = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { rideId } = req.body;

    try {
        // Find the ride to get fare details
        const ride = await rideModel.findById(rideId).populate('user');

        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        // Create payment intent
        const paymentIntent = await stripeService.createPaymentIntent(ride);

        res.status(200).json(paymentIntent);
    } catch (error) {
        console.error("Payment Intent Error:", error);
        res.status(500).json({ message: "Error creating payment intent", error: error.message })
    }
}

module.exports.confirmPayment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { rideId, paymentIntentId } = req.body;

    try {
        const ride = await stripeService.confirmPayment(rideId, paymentIntentId);
        res.status(200).json(ride);
    } catch (error) {
        console.error("Payment Confirmation Error:", error);
        res.status(500).json({ message: "Error confirming payment", error: error.message })
    }
}


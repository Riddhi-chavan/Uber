const express = require('express')
const router = express.Router()
const { body, query } = require('express-validator')
const rideController = require('../controllers/ride.controller')
const authMiddleware = require('../middlewares/auth.middleware')


router.post('/create',
    authMiddleware.authUser,
    body('pickup').isString().isLength({ min: 3, max: 100 }).withMessage("Invalid pickup address"),
    body('destination').isString().isLength({ min: 3, max: 100 }).withMessage("Invalid destination address"),
    body('vehicleType').isString().isIn(["auto", "car", "moto"]).withMessage("Invalid vehicle type"),
    body('paymentMode').isString().isIn(["Cash", "Card"]).optional({ checkFalsy: true }).withMessage("Invalid payment mode"),
    rideController.createRide)


router.get('/get-fare',
    authMiddleware.authUser,
    query('pickup').isString().isLength({ min: 3, max: 100 }).withMessage("Invalid pickup address"),
    query('destination').isString().isLength({ min: 3, max: 100 }).withMessage("Invalid destination address"),
    rideController.getFare)


router.post('/confirm-ride',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage("Invalid ride id"),
    rideController.confirmRide)

router.get('/start-ride', authMiddleware.authCaptain,
    query('rideId').isMongoId().withMessage('Invalid ride id'),
    query('otp').isString().isLength({ min: 6, max: 6 }).withMessage("invalid OTP"),
    rideController.startRide
)

router.post('/end-ride',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.endRide
)

router.post('/create-payment-intent',
    authMiddleware.authUser,
    body('rideId').isMongoId().withMessage("Invalid ride id"),
    rideController.createPaymentIntent
)

router.post('/confirm-payment',
    authMiddleware.authUser,
    body('rideId').isMongoId().withMessage("Invalid ride id"),
    body('paymentIntentId').isString().withMessage("Invalid payment intent"),
    rideController.confirmPayment
)


module.exports = router
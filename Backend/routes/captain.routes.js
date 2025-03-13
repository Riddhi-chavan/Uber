const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const captainController = require('../controllers/captain.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'captain-uploads/'); // Make sure this directory exists
    },
    filename: function (req, file, cb) {
        // Create unique filename with original extension
        crypto.randomBytes(16, (err, buf) => {
            if (err) return cb(err);
            cb(null, buf.toString('hex') + path.extname(file.originalname));
        });
    }
});

// Filter files to only allow images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Set up multer upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});

// Modified route to match frontend field names
router.post('/register', [
    upload.single('profilePic'),
    body('email').isEmail().withMessage('Invalid Email'),
    body('firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('lastname').isLength({ min: 3 }).withMessage('Last name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicleColor').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehiclePlate').isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
    body('vehicleCapacity').isNumeric().withMessage('Capacity must be a number'),
    body('vehicleType').isIn(['car', 'auto', 'moto']).withMessage('Vehicle type must be car, auto or moto')
],
    captainController.registerCaptain
);


router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], captainController.loginCaptain)

router.get("/profile", authMiddleware.authCaptain, captainController.getCaptainProfile)

router.get("/logout", authMiddleware.authCaptain, captainController.logoutCaptain)

router.get("/ride-stats", authMiddleware.authCaptain, captainController.getCaptainRideStats)

module.exports = router;


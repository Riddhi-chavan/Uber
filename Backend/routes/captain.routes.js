const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const captainController = require('../controllers/captain.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

console.log('🔧 Loading captain routes with Cloudinary storage');

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'captain-profiles',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
            { width: 500, height: 500, crop: 'limit' },
            { quality: 'auto' }
        ]
    }
});

console.log('✅ Cloudinary storage configured');

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

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
], captainController.registerCaptain);

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], captainController.loginCaptain);

router.get("/profile", authMiddleware.authCaptain, captainController.getCaptainProfile);

router.get("/logout", authMiddleware.authCaptain, captainController.logoutCaptain);

router.get("/ride-stats", authMiddleware.authCaptain, captainController.getCaptainRideStats);

router.put('/profile/picture', 
    authMiddleware.authCaptain,
    upload.single('profilePic'),
    captainController.updateProfilePicture
);



module.exports = router;
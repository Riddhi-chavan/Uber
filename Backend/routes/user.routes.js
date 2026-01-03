// routes/user.routes.js
const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

console.log('🔧 Loading user routes with Cloudinary storage');

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'user-profiles',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
            { width: 500, height: 500, crop: 'limit' },
            { quality: 'auto' }
        ]
    }
});

console.log('✅ Cloudinary storage configured for users');

// Set up multer upload with error handling
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        console.log('📁 File filter check:', {
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype
        });
        
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Multer error handling middleware
const handleMulterError = (err, req, res, next) => {
    console.error('❌ Multer Error:', err);
    
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File size too large. Maximum 5MB allowed.' });
        }
        return res.status(400).json({ message: `Upload error: ${err.message}` });
    }
    
    if (err) {
        return res.status(400).json({ message: err.message });
    }
    
    next();
};

router.post('/register', 
    (req, res, next) => {
        console.log('📥 Register request received');
        console.log('Body:', req.body);
        console.log('Content-Type:', req.headers['content-type']);
        next();
    },
    upload.single('profilePic'),
    handleMulterError,
    [
        body('email').isEmail().withMessage('Invalid Email'),
        body('firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    userController.resgisterUser
);

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], userController.loginUser);

router.get('/logout', authMiddleware.authUser, userController.logoutUser);

router.get('/profile', authMiddleware.authUser, userController.getUserProfile);

router.put('/profile/picture', 
    authMiddleware.authUser,
    upload.single('profilePic'),
    handleMulterError,
    userController.updateProfilePicture
);

module.exports = router;
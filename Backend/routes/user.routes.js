const express = require('express') // it's a node js framework 
const router = express.Router() // initialise router for api request
const { body } = require("express-validator") //It's used to validate and sanitize request body data in your Express application.
const userController = require("../controllers/user.controller")
const authMiddlewear = require("../middlewares/auth.middleware")
const multer = require('multer')
const path = require('path')
const crypto = require('crypto')

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function(req, file, cb) {
    // Create unique filename with original extension
    crypto.randomBytes(16, (err, buf) => {
      if (err) return cb(err)
      cb(null, buf.toString('hex') + path.extname(file.originalname))
    })
  }
})

// Filter files to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed!'), false)
  }
}

// Set up multer upload
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
})

router.post('/register', [
    upload.single('profilePic'), // Add multer middleware
    body('email').isEmail().withMessage('Invalid Email'),
    body('firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], userController.resgisterUser)

module.exports = router;


router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
]
, userController.loginUser
)

router.get('/logout', authMiddlewear.authUser, userController.logoutUser)

router.get('/profile', authMiddlewear.authUser, userController.getUserProfile)
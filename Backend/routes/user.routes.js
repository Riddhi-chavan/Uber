const express = require('express') // it's a node js framework 
const router = express.Router() // initialise router for api request
const { body } = require("express-validator") //It's used to validate and sanitize request body data in your Express application.
const userController = require("../controllers/user.controller")
const authMiddlewear = require("../middlewares/auth.middleware")

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
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
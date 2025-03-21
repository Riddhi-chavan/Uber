const userModel = require('../models/user.model')
const userService = require("../services/user.service")
const { validationResult } = require("express-validator")
const blacklistTokenModel = require("../models/blacklistToken.model")
const fs = require('fs')

module.exports.resgisterUser = async (req, res, next) => {
    try {
        const errors = validationResult(req); //shows the any input errors
        if (!errors.isEmpty()) {
            // If file was uploaded, delete it on validation error
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ errors: errors.array() }) //list the errors in array form 
        }

        const { firstname, lastname, email, password } = req.body; //take all the fields entered by user
        
        const isUserAlreadyExist = await userModel.findOne({ email }) //check if the user already exist in the database
        if(isUserAlreadyExist){
            // If file was uploaded, delete it if user already exists
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({message : "User already exist"})
        }
        
        const hashPassword = await userModel.hashPassword(password) //call hashpassword for creating a hash version of the given plain password

        // Get profile picture path if uploaded
        const profilePicture = req.file ? `/uploads/${req.file.filename}` : '';

        const user = await userService.createUser({
            firstname,
            lastname,
            email,
            password: hashPassword,
            profilePicture
        })

        const token = user.generateAuthToken();
        res.status(201).json({ token, user })
    } catch (error) {
        // If file was uploaded, delete it on error
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({email}).select("+password")


    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" })
    }

    const isMatch = await user.comparePassword(password, user.password)

    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" })
    }

    const token = user.generateAuthToken();
    res.cookie("token", token, { httpOnly: true})
    res.status(200).json({ token, user })
}

module.exports.getUserProfile = async (req, res, next) => { 
    res.status(200).json(req.user)
}

module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie("token")
    const token = req.cookies.token || req.headers.authorization.split(" ")[1]
    await blacklistTokenModel.create({token})
    res.status(200).json({message : "Logged out successfully"})
}
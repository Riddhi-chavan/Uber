// user.controller.js
const userModel = require('../models/user.model')
const userService = require("../services/user.service")
const { validationResult } = require("express-validator")
const blacklistTokenModel = require("../models/blacklistToken.model")
const cloudinary = require('../config/cloudinary')

module.exports.resgisterUser = async (req, res, next) => {
    try {
        console.log('📝 Registration attempt:', { 
            body: req.body, 
            hasFile: !!req.file,
            file: req.file ? { 
                fieldname: req.file.fieldname,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                path: req.file.path,
                filename: req.file.filename 
            } : null
        });

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('❌ Validation errors:', errors.array());
            // If file was uploaded to Cloudinary, delete it on validation error
            if (req.file && req.file.filename) {
                try {
                    await cloudinary.uploader.destroy(req.file.filename);
                    console.log('🗑️ Deleted file from Cloudinary due to validation error');
                } catch (err) {
                    console.error('Failed to delete file from Cloudinary:', err);
                }
            }
            return res.status(400).json({ errors: errors.array() })
        }

        const { firstname, lastname, email, password } = req.body;
        
        console.log('🔍 Checking if user exists:', email);
        const isUserAlreadyExist = await userModel.findOne({ email })
        
        if(isUserAlreadyExist){
            console.log('⚠️ User already exists');
            // If file was uploaded to Cloudinary, delete it if user already exists
            if (req.file && req.file.filename) {
                try {
                    await cloudinary.uploader.destroy(req.file.filename);
                    console.log('🗑️ Deleted file from Cloudinary - user exists');
                } catch (err) {
                    console.error('Failed to delete file from Cloudinary:', err);
                }
            }
            return res.status(400).json({message : "User already exist"})
        }
        
        console.log('🔐 Hashing password...');
        const hashPassword = await userModel.hashPassword(password)

        // Get Cloudinary URL and public_id if uploaded
        const profilePicture = req.file ? req.file.path : '';
        const profilePicPublicId = req.file ? req.file.filename : '';

        console.log('👤 Creating user with:', {
            firstname,
            lastname,
            email,
            hasProfilePic: !!profilePicture,
            profilePicture,
            profilePicPublicId
        });

        const user = await userService.createUser({
            firstname,
            lastname,
            email,
            password: hashPassword,
            profilePicture,
            profilePicPublicId
        })

        console.log('✅ User created successfully:', user._id);

        const token = user.generateAuthToken();
        res.status(201).json({ token, user })
    } catch (error) {
        console.error('❌ Registration error:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });

        // If file was uploaded to Cloudinary, delete it on error
        if (req.file && req.file.filename) {
            try {
                await cloudinary.uploader.destroy(req.file.filename);
                console.log('🗑️ Deleted file from Cloudinary due to error');
            } catch (err) {
                console.error('Failed to delete file from Cloudinary:', err);
            }
        }
        
        res.status(500).json({ 
            message: 'Server error during registration', 
            error: error.message,
            details: error.stack 
        });
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

module.exports.updateProfilePicture = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await userModel.findById(req.user._id);

        // Delete old profile picture from Cloudinary if it exists
        if (user.profilePicPublicId) {
            await cloudinary.uploader.destroy(user.profilePicPublicId);
        }

        // Update with new picture
        user.profilePicture = req.file.path;
        user.profilePicPublicId = req.file.filename;
        await user.save();

        res.status(200).json({ 
            message: 'Profile picture updated successfully',
            profilePicture: user.profilePicture 
        });
    } catch (error) {
        if (req.file && req.file.filename) {
            await cloudinary.uploader.destroy(req.file.filename);
        }
        console.error('Update profile picture error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
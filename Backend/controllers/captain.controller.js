
const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');
const cloudinary = require('../config/cloudinary');

module.exports.registerCaptain = async (req, res, next) => {
    console.log('=== REGISTRATION DEBUG ===');
    console.log('1. Request body:', req.body);
    console.log('2. File received:', req.file);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('3. Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { firstname, lastname, email, password, vehicleColor, vehiclePlate, vehicleCapacity, vehicleType } = req.body;

    try {
        // Check if captain already exists
        const isCaptainAlreadyExists = await captainModel.findOne({ email });
        if (isCaptainAlreadyExists) {
            console.log('4. Captain already exists');
            return res.status(400).json({ message: 'Captain already exists' });
        }

        // Hash password
        const hashedPassword = await captainModel.hashPassword(password);
        console.log('5. Password hashed successfully');

        // Prepare captain data
        const captainData = {
            fullname: {
                firstname,
                lastname
            },
            email,
            password: hashedPassword,
            vehicle: {
                color: vehicleColor,
                plate: vehiclePlate,
                capacity: vehicleCapacity,
                vehicleType: vehicleType
            }
        };

        // Add profile picture URL if uploaded
        if (req.file) {
            console.log('6. Profile pic details:', {
                path: req.file.path,
                filename: req.file.filename,
                size: req.file.size
            });
            captainData.profilePicture = req.file.path; // Cloudinary URL
            captainData.profilePicPublicId = req.file.filename; // For deletion later
        } else {
            console.log('6. No profile pic uploaded');
        }

        console.log('7. Creating captain with data:', captainData);

        // Create captain
        const captain = await captainService.createCaptain(captainData);
        console.log('8. Captain created successfully:', captain._id);

        

        // Generate token
        const token = captain.generateAuthToken();

        res.status(201).json({ 
            token, 
            captain: {
                _id: captain._id,
                fullname: captain.fullname,
                email: captain.email,
                profilePicture: captain.profilePicture, // FIXED: was profilePic
                vehicle: captain.vehicle
            }
        });
    } catch (error) {
        console.error('9. Registration error:', error);
        
        // Clean up uploaded image if captain creation fails
        if (req.file && req.file.filename) {
            try {
                console.log('10. Cleaning up uploaded image');
                await cloudinary.uploader.destroy(req.file.filename);
            } catch (cleanupError) {
                console.error('11. Error cleaning up image:', cleanupError);
            }
        }
        
        res.status(500).json({ message: 'Error registering captain', error: error.message });
    }
};

module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const captain = await captainModel.findOne({ email }).select('+password');

        if (!captain) {
            return res.status(404).json({ error: "Captain not found" });
        }

        const isMatch = await captain.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = captain.generateAuthToken();

        res.cookie('token', token, { httpOnly: true });

        res.status(200).json({ 
            captain: {
                _id: captain._id,
                fullname: captain.fullname,
                email: captain.email,
                profilePicture: captain.profilePicture, // FIXED: was not included
                vehicle: captain.vehicle,
                status: captain.status
            }, 
            token 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: "Server error", message: error.message });
    }
};

module.exports.getCaptainProfile = async (req, res, next) => {
    try {
        res.status(200).json({ 
            captain: {
                _id: req.captain._id,
                fullname: req.captain.fullname,
                email: req.captain.email,
                profilePicture: req.captain.profilePicture, // FIXED: added profilePicture
                vehicle: req.captain.vehicle,
                status: req.captain.status
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: "Server error", message: error.message });
    }
};

module.exports.logoutCaptain = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        await blacklistTokenModel.create({ token }); // FIXED: was BlacklistToken
        res.clearCookie('token');
        res.status(200).json({ message: "Logout successfully" });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: "Server error", message: error.message });
    }
};

module.exports.getCaptainRideStats = async (req, res, next) => {
    try {
        const captain = await captainModel.findById(req.captain._id);

        if (!captain) {
            return res.status(404).json({
                error: "Captain not found",
                message: "Unable to retrieve ride statistics"
            });
        }

        // Ensure stats exist with default values
        const rideStats = captain.rideStats || {
            todayRides: 0,
            totalRides: 0
        };

        const earningStats = captain.earningStats || {
            todayEarnings: 0,
            totalEarnings: 0
        };

        res.status(200).json({
            todayRides: rideStats.todayRides || 0,
            totalRides: rideStats.totalRides || 0,
            todayEarnings: earningStats.todayEarnings || 0,
            totalEarnings: earningStats.totalEarnings || 0
        });
    } catch (error) {
        console.error("Error in getCaptainRideStats:", error);
        res.status(500).json({
            error: "Server error",
            message: "Unable to retrieve ride statistics",
            details: error.message
        });
    }
};

module.exports.updateProfilePicture = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const captain = req.captain;

        // Delete old profile picture from Cloudinary if it exists
        if (captain.profilePicPublicId) {
            try {
                await cloudinary.uploader.destroy(captain.profilePicPublicId);
            } catch (error) {
                console.error('Error deleting old image:', error);
            }
        }

        // Update captain with new profile picture
        captain.profilePicture = req.file.path;
        captain.profilePicPublicId = req.file.filename;
        await captain.save();

        res.status(200).json({ 
            message: 'Profile picture updated successfully',
            profilePicture: captain.profilePicture
        });
    } catch (error) {
        console.error('Update profile picture error:', error);
        res.status(500).json({ message: 'Error updating profile picture', error: error.message });
    }
};
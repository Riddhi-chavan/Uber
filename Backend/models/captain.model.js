const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters long']
        },
        lastname: {
            type: String,
            required: true,
            minlength: [3, 'Last name must be at least 3 characters long']
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    profilePicture: {
        type: String,
        default: 'https://res.cloudinary.com/demo/image/upload/v1234567890/default-avatar.png'
    },
    profilePicPublicId: {
        type: String // Store Cloudinary public_id for deletion
    },
    socketId: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    vehicle: {
        color: {
            type: String,
            required: true,
            minlength: [3, 'Color must be at least 3 characters long']
        },
        plate: {
            type: String,
            required: true,
            minlength: [3, 'Plate must be at least 3 characters long']
        },
        capacity: {
            type: Number,
            required: true,
            min: [1, 'Capacity must be at least 1']
        },
        vehicleType: {
            type: String,
            required: true,
            enum: ['car', 'auto', 'moto']
        }
    },
    location: {
        ltd: {
            type: Number
        },
        lng: {
            type: Number
        }
    },
    rideStats: {
        type: Object,
        default: {}
    },
    earningStats: {
        type: Object,
        default: {}
    },
    createdAt : {
        type : Date ,
        default : Date.now
    }
}, {
    timestamps: true
});

captainSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
};

captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

captainSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

// Helper function to get today's date
const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
};

captainSchema.methods.incrementTodayRideCount = async function() {
    const today = getTodayDate();
    
    if (!this.rideStats) {
        this.rideStats = {};
    }
    
    if (!this.rideStats[today]) {
        this.rideStats[today] = 0;
    }
    this.rideStats[today]++;
    
    this.markModified('rideStats');
    await this.save();
    
    return this;
};

captainSchema.methods.updateEarnings = async function(amount) {
    const today = getTodayDate();
    
    if (!this.earningStats) {
        this.earningStats = {};
    }
    
    if (!this.earningStats[today]) {
        this.earningStats[today] = 0;
    }
    this.earningStats[today] += amount;
    
    this.markModified('earningStats');
    await this.save();
    
    return this;
};

const captainModel = mongoose.model('captain', captainSchema);

module.exports = captainModel;
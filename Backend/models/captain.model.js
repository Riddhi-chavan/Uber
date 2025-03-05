const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const captainSchema = mongoose.Schema({ 
    fullname: { 
        firstname : {
            type: String,
            required: true,
            minlength: [3 ,"Firstname must of at least 3 characters long "]
        },
        lastname : {
            type: String,
            minlength: [3 ,"Lastname must of at least 3 characters long"]
         }
     },
     email : {
        type: String,
        required: true,
        lowercase: true,
        match : [/.+\@.+\..+/ , "Please fill a valid email address"]
     },
     password : {
        type : String,
        required  : true,
        select : false
     },
     socketId : {
        type : String
     },
     status : {
        type : String,
        enum : ['active', 'inactive'],
        default : 'inactive'
     },
     vehicle : {
        color : {
            type : String,
            required : true,
            minlength : [3, "Color must be at least 3 characters long"]
        },
        plate : {
            type : String,
            required : true,
            minlength : [3, "Plate must be at least 3 characters long"]
        },
        capacity : {
            type : Number,
            required : true,
            min : [1, "Capacity must be at least 1"]
        },
        vehicleType : {
            type : String,
            required : true,
            enum : ['car', 'motorcycle', 'auto']
         }
     },
     location  : {
        ltd : {
            type : Number,
        },
        lng : {
            type : Number,
        }
     }, rideStats: {
        todayRides: {
            type: Number,
            default: 0
        },
        lastResetDate: {
            type: Date,
            default: Date.now
        },
        totalRides: {
            type: Number,
            default: 0
        }
     },
     earningStats: {
        todayEarnings: {
            type: Number,
            default: 0
        },
        totalEarnings: {
            type: Number,
            default: 0
        },
        lastResetDate: {
            type: Date,
            default: Date.now
        }
    }
})

captainSchema.methods.incrementTodayRideCount = async function() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if we need to reset the counter (it's a new day)
    if (this.rideStats.lastResetDate) {
        const lastReset = new Date(this.rideStats.lastResetDate);
        lastReset.setHours(0, 0, 0, 0);
        
        if (lastReset.getTime() < today.getTime()) {
            // It's a new day, reset the counter
            this.rideStats.todayRides = 0;
            this.rideStats.lastResetDate = today;
        }
    }
    
    // Increment the counters
    this.rideStats.todayRides += 1;
    this.rideStats.totalRides += 1;
    
    return this.save();
}

captainSchema.methods.updateEarnings = async function(rideEarning) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Ensure earningStats exists
    if (!this.earningStats) {
        this.earningStats = {
            todayEarnings: 0,
            totalEarnings: 0,
            lastResetDate: today
        };
    }
    
    // Check if we need to reset daily earnings
    const lastReset = new Date(this.earningStats.lastResetDate);
    lastReset.setHours(0, 0, 0, 0);
    
    if (lastReset.getTime() < today.getTime()) {
        // It's a new day, reset today's earnings
        this.earningStats.todayEarnings = 0;
        this.earningStats.lastResetDate = today;
    }
    
    // Update earnings
    this.earningStats.todayEarnings += rideEarning;
    this.earningStats.totalEarnings += rideEarning;
    
    return this.save();
}


captainSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token
}

captainSchema.methods.comparePassword = async function (password) { //compare the plain password with hash version stored in db
    return await bcrypt.compare(password, this.password)
}

captainSchema.statics.hashPassword = async function (password) { // create a hashed version of the plain text
    return await bcrypt.hash(password, 10)
 }

const captainModel = mongoose.model('captain', captainSchema)

module.exports = captainModel

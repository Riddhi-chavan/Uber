const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true, // Changed from 'require' to 'required'
            minlength: [3, 'First name must be at least 3 characters long'],
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be at least 3 characters long'],
        }
    },
    email: {
        type: String,
        required: true, // Changed from 'require' to 'required'
        unique: true,
        lowercase: true, // Added to normalize emails
        minlength: [5, 'Email must be at least 5 characters long']
    },
    password: {
        type: String,
        required: true, // Changed from 'require' to 'required'
        select: false
    },
    socketId: {
        type: String
    },
    profilePicture: {
        type: String,
        default: '' // Cloudinary URL
    },
    profilePicPublicId: {
        type: String,
        default: '' // Cloudinary public_id for deletion
    },
    createdAt : {
        type : Date ,
        default : Date.now
    }
}, { timestamps: true }); // Added timestamps for createdAt and updatedAt

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10)
}

const userModel = mongoose.model('user', userSchema)

module.exports = userModel
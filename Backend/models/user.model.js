const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            require: true,
            minlength: [3, 'First name must be at least 3 characters long'],

        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be at least 3 characters long'],

        }
    },
    email: {
        type: String,
        require: true,
        unique: true,
        minlength: [5, 'Email must be at least 5 characters long']
    },
    password: {
        type: String,
        require: true,
        select: false

    },
    scoketId: {
        type: String
    }
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET); //generate a unique token for each individual user
    return token
}

userSchema.methods.comparePassword = async function (password) { //compare the plain password with hash version stored in db
    return await bcrypt.compare(password, this.password)
}

userSchema.statics.hashPassword = async function (password) { // create a hashed version of the plain text
    return await bcrypt.hash(password, 10)
}

const userModel = mongoose.model('user', userSchema) //creates and registers a Mongoose model for your user collection

module.exports = userModel
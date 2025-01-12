const userModel = require('../models/user.model')
const userService = require("../services/user.service")
const { validationResult } = require("express-validator")

module.exports.resgisterUser = async (req, res, next) => {
    const errors = validationResult(req); //shows the any input errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }) //list the errors in array form 
    }

    console.log(req.body)

    const { fullname, email, password } = req.body; //take all the fields entered by user
    const hashPassword = await userModel.hashPassword(password) //call hashpassword for creating a hash version of the given plain password


    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashPassword
    })


    const token = user.generateAuthToken();
    res.status(201).json({ token, user })


}
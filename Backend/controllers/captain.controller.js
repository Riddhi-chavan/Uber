const BlacklistToken = require('../models/blacklistToken.model')
const captainModel = require('../models/captain.model')
const captainService = require('../services/captain.service')
const  { validationResult } = require('express-validator')

module.exports.registerCaptain = async (req, res , next) => { 
    // console.log(req.body)
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }

    const {fullname , email, password , vehicle} = req.body
    
    const isCaptainAlreadyExist = await captainModel.findOne({email})

    if(isCaptainAlreadyExist){
        return res.status(401).json({error : "Captain already exist"})
    }
    const hashedPassword = await captainModel.hashPassword(password)

    const captain = await captainService.createCaptain({
        firstname : fullname.firstname,
        lastname : fullname.lastname,
        email ,
        password  : hashedPassword,
        color  : vehicle.color,
        plate : vehicle.plate,
        capacity    : vehicle.capacity,
        vehicleType : vehicle.vehicleType

    })

    const token  = captain.generateAuthToken()
    res.status(201).json({captain, token})


}


module.exports.loginCaptain = async (req, res , next) => { 
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }

    const {email, password} = req.body

    const captain = await captainModel.findOne({email}).select('+password');

    if(!captain){
        return res.status(404).json({error : "Captain not found"})
    }

    const isMatch = await captain.comparePassword(password)

    if(!isMatch){
        return res.status(401).json({error : "Invalid email or password"})
    }

    const token  = captain.generateAuthToken()

    res.cookie('token', token, {httpOnly : true})

    res.status(200).json({captain, token})
}


module.exports.getCaptainProfile = async (req, res , next) => { 
    res.status(200).json({captain : req.captain})
}

module.exports.logoutCaptain = async (req, res , next) => { 
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    await BlacklistToken.create({token})
    res.clearCookie('token')
    res.status(200).json({message : "Logout successfully"})
}
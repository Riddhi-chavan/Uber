const userModel = require('../models/user.model')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken") 
const BlacklistToken = require('../models/blacklistToken.model')
const captainModel = require('../models/captain.model')


module.exports.authUser = async (req , res , next) => { 
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    if(!token) return res.status(401).json({message : "Unauthorized"})
    
    const isBlacklisted = await BlacklistToken.findOne({token  : token})

    if(isBlacklisted) return res.status(401).json({message : "Unauthorized"})
    
    
    try {
        const decode = jwt.verify(token , process.env.JWT_SECRET)
        const user = await userModel.findById(decode._id)
        req.user = user
        return next()
    } catch (error) {
        
    }

}

module.exports.authCaptain = async (req , res , next) => { 
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    if(!token) return res.status(401).json({message : "Unauthorized"})
    
    const isBlacklisted = await BlacklistToken.findOne({token  : token})

    if(isBlacklisted) return res.status(401).json({message : "Unauthorized"})
    
    try {
        const decode = jwt.verify(token , process.env.JWT_SECRET)
        const captain = await captainModel.findById(decode._id)
        req.captain = captain
        return next()
    } catch (error) {
        res.status(401).json({message : "Unauthorized"})
    }

}


const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service')

module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { address } = req.query
    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates)
    } catch (err) {
        console.error("Detailed error:", err); // Add this line
        res.status(404).json({
            message: "Coordinate not found",
            error: err.message  // Add this line to see the error message
        })
    }
}

module.exports.getDistanceTime = async (req, res, next) => {

    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() })
        }
        const { origin, destination } = req.query;
        const distanceTime = await mapService.getDistanceTime(origin, destination);
        res.status(200).json(distanceTime);

    } catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({ message: "Error getting distance and time", error: error.message, })

    }
}


module.exports.getAutoCompleteSuggestions = async (req, res, next) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() })
        }
        const { input } = req.query;
        const suggestion = await mapService.getAutoCompleteSuggestions(input);
        res.status(200).json(suggestion);

    } catch (error) {
        console.error("Detailed error:", error);
        res.status(500).json({ message: "Error getting suggestions", error: error.message })

    }
}
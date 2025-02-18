const axios = require('axios');
const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        console.log("Making request to URL:", url); // Add this (but remove the API key before sharing logs)
        const response = await axios.get(url);
        console.log("Google API Response:", response.data); // Add this

        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error(`Google API Error: ${response.data.status}`);
        }
    } catch (error) {
        console.error("Full error:", error);
        if (error.response) {
            console.error("API Response Error:", error.response.data);
        }
        throw error;
    }
};

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error("Origin and destination are required")
    }
    const apiKey = process.env.GOOGLE_MAPS_API;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;


    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            if (response.data.rows[0].elements[0].status === 'ZERO_RESULTS') {
                throw new Error("Origin or destination not found");
            }

            return response.data.rows[0].elements[0];
        } else {
            throw new Error(`Google API Error: ${response.data.status}`);
        }

    } catch (err) {
        console.error("Detailed error:", err);
        throw err;
    }

}

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error(" query is required");
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            return response.data.predictions;
        } else {
            throw new Error(`Google API Error: ${response.data.status}`);
        }
    } catch (error) {
        console.error("Detailed error:", error);
        throw error;
    }

}

module.exports.getCaptainInTheRedius = async (ltd , lng , radius) => {   
    const captain = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[ltd, lng], radius / 3963.2]
            }
        }, 
    })
 }
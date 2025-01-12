const mongoose = require('mongoose')


function connectToDb() {
    mongoose.connect(process.env.DB_CONNECT, {
    })
        .then(() => console.log("Connected to the database successfully"))
        .catch(err => console.log("Database connection error:", err));
}

module.exports = connectToDb
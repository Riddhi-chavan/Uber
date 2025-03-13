const dotenv = require("dotenv")
dotenv.config()
const cors = require('cors')
const express = require('express') //way to import 
const app = express()
const connecToDb = require("./db/db")
const userRoutes = require("./routes/user.routes")
const CookieParser = require("cookie-parser")
const captainRoutes = require("./routes/captain.routes")
const mapsRoutes = require('./routes/maps.routes')
const rideRoutes = require('./routes/ride.routes')

connecToDb()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(CookieParser())
app.get("/", (req, res) => {
    res.send("Hello world ")
})
app.use("/users", userRoutes)
app.use("/captains", captainRoutes)
app.use("/maps", mapsRoutes)
app.use("/rides", rideRoutes)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


module.exports = app
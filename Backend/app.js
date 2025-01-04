const dotenv = require("dotenv")
dotenv.config()
const cors = require('cors')
const express  = require('express') //way to import 
const app = express()


app.use(cors())
app.get("/" , (req , res) => {
    res.send("Hello world ")
})

module.exports = app
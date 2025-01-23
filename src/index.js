const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")

// const authRoute = require("../routes/authRoute")
// const dashboardRoute = require("../routes/dashboardRoute")

dotenv.config()
const app = express()
app.use(cors())

async function connectToMongo() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
    } catch (error) {
        console.log(error)
    }
}

connectToMongo().then(() => { console.log("Successfully connected to database") });

app.get("/", (req, res) => {
    req.setEncoding("Server listening on the get request")
})

// app.use("/api/auth", authRoute);
// app.use("/api/dashboard", dashboardRoute)

app.listen((req, res) => {
    console.log(`Server started on PORT ${process.env.PORT}`);
})
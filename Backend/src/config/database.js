const mongoose = require("mongoose")

async function connectToDB() {
    console.log("Trying to connect to MongoDB...")

    console.log(
        "MONGO_URI loaded:",
        process.env.MONGO_URI ? "Yes" : "No"
    )

    try {
        const connection =
            await mongoose.connect(
                process.env.MONGO_URI,
                {
                    serverSelectionTimeoutMS: 10000
                }
            )

        console.log(
            "Connected to MongoDB:",
            connection.connection.host
        )
    } catch (error) {
        console.log("MongoDB connection error:")
        console.log(error)
        throw error
    }
}

module.exports = connectToDB
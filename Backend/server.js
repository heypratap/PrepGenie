require("dotenv").config()

const app = require("./src/app")
const connectToDB = require("./src/config/database")

const PORT = process.env.PORT || 3000

async function startServer() {
    try {
        await connectToDB()

        app.listen(PORT, () => {
            console.log(
                `PrepGenie server is running on port ${PORT}`
            )
        })
    } catch (error) {
        console.log(
            "Failed to start PrepGenie"
        )

        console.log(error.message)

        process.exit(1)
    }
}

startServer()
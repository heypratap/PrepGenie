const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

const app = express()


const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
].filter(Boolean)


app.use(
    cors({
        origin: function (origin, callback) {

            if (!origin) {
                return callback(null, true)
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true)
            }

            return callback(
                new Error(
                    `CORS blocked origin: ${origin}`
                )
            )
        },

        credentials: true
    })
)


app.use(express.json())
app.use(cookieParser())


app.get("/", (req, res) => {
    res.json({
        message: "PrepGenie API is running"
    })
})


app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "PrepGenie backend is running"
    })
})


app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)


module.exports = app
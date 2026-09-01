const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")


const isProduction =
    process.env.NODE_ENV === "production"


const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000
}


async function registerUserController(req, res) {
    try {
        const {
            username,
            email,
            password
        } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password"
            })
        }

        const finalUsername =
            (
                username ||
                email.split("@")[0] ||
                ""
            ).trim()

        const normalizedEmail =
            email.toLowerCase()

        const existingUser =
            await userModel.findOne({
                $or: [
                    {
                        username: finalUsername
                    },
                    {
                        email: normalizedEmail
                    }
                ]
            })

        if (existingUser) {
            return res.status(400).json({
                message:
                    "Username or email already exists"
            })
        }

        const hash =
            await bcrypt.hash(
                password,
                10
            )

        const user =
            await userModel.create({
                username: finalUsername,
                email: normalizedEmail,
                password: hash,
                usernameUpdates: []
            })

        const token =
            jwt.sign(
                {
                    id: user._id,
                    username: user.username
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            )

        res.cookie(
            "token",
            token,
            cookieOptions
        )

        res.status(201).json({
            message:
                "User registered successfully",

            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                usernameUpdatesCount: 0,
                remainingUpdates: 2
            }
        })

    } catch (error) {
        console.error(
            "Register error:",
            error
        )

        res.status(500).json({
            message:
                "Something went wrong"
        })
    }
}


async function loginUserController(req, res) {
    try {
        const {
            email,
            username,
            identifier,
            password
        } = req.body

        const userIdentifier =
            (
                identifier ||
                email ||
                username ||
                ""
            ).trim()

        if (
            !userIdentifier ||
            !password
        ) {
            return res.status(400).json({
                message:
                    "Username or Email and password are required"
            })
        }

        const user =
            await userModel.findOne({
                $or: [
                    {
                        email:
                            userIdentifier.toLowerCase()
                    },
                    {
                        username:
                            userIdentifier
                    }
                ]
            })

        if (!user) {
            return res.status(400).json({
                message:
                    "Invalid username/email or password"
            })
        }

        const passwordValid =
            await bcrypt.compare(
                password,
                user.password
            )

        if (!passwordValid) {
            return res.status(400).json({
                message:
                    "Invalid username/email or password"
            })
        }

        const token =
            jwt.sign(
                {
                    id: user._id,
                    username: user.username
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            )

        res.cookie(
            "token",
            token,
            cookieOptions
        )

        const thirtyDaysAgo =
            new Date(
                Date.now() -
                30 *
                24 *
                60 *
                60 *
                1000
            )

        const recentUpdates =
            (
                user.usernameUpdates ||
                []
            ).filter(
                (date) =>
                    new Date(date) >
                    thirtyDaysAgo
            )

        res.status(200).json({
            message:
                "Logged in successfully",

            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                usernameUpdatesCount:
                    recentUpdates.length,
                remainingUpdates:
                    Math.max(
                        0,
                        2 -
                        recentUpdates.length
                    )
            }
        })

    } catch (error) {
        console.error(
            "Login error:",
            error
        )

        res.status(500).json({
            message:
                "Something went wrong"
        })
    }
}


async function logoutUserController(req, res) {
    try {
        const token =
            req.cookies.token

        if (token) {
            await tokenBlacklistModel.create({
                token
            })
        }

        res.clearCookie(
            "token",
            {
                httpOnly: true,
                secure: isProduction,
                sameSite:
                    isProduction
                        ? "none"
                        : "lax"
            }
        )

        res.status(200).json({
            message:
                "Logged out successfully"
        })

    } catch (error) {
        console.error(
            "Logout error:",
            error
        )

        res.status(500).json({
            message:
                "Something went wrong"
        })
    }
}


async function getMeController(req, res) {
    try {
        const user =
            await userModel.findById(
                req.user.id
            )

        if (!user) {
            return res.status(404).json({
                message:
                    "User not found"
            })
        }

        const thirtyDaysAgo =
            new Date(
                Date.now() -
                30 *
                24 *
                60 *
                60 *
                1000
            )

        const recentUpdates =
            (
                user.usernameUpdates ||
                []
            ).filter(
                (date) =>
                    new Date(date) >
                    thirtyDaysAgo
            )

        res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                usernameUpdatesCount:
                    recentUpdates.length,
                remainingUpdates:
                    Math.max(
                        0,
                        2 -
                        recentUpdates.length
                    )
            }
        })

    } catch (error) {
        console.error(
            "Get user error:",
            error
        )

        res.status(500).json({
            message:
                "Something went wrong"
        })
    }
}


async function updateUsernameController(req, res) {
    try {
        const {
            username
        } = req.body

        const newUsername =
            (username || "").trim()

        if (!newUsername) {
            return res.status(400).json({
                message:
                    "Please enter a valid username"
            })
        }

        if (
            newUsername.length < 3 ||
            newUsername.length > 30
        ) {
            return res.status(400).json({
                message:
                    "Username must be between 3 and 30 characters"
            })
        }

        const user =
            await userModel.findById(
                req.user.id
            )

        if (!user) {
            return res.status(404).json({
                message:
                    "User not found"
            })
        }

        if (
            user.username.toLowerCase() ===
            newUsername.toLowerCase()
        ) {
            return res.status(400).json({
                message:
                    "New username must be different from current username"
            })
        }

        const thirtyDaysAgo =
            new Date(
                Date.now() -
                30 *
                24 *
                60 *
                60 *
                1000
            )

        const recentUpdates =
            (
                user.usernameUpdates ||
                []
            ).filter(
                (date) =>
                    new Date(date) >
                    thirtyDaysAgo
            )

        if (recentUpdates.length >= 2) {
            const oldestRecent =
                new Date(
                    recentUpdates[0]
                )

            const nextAvailable =
                new Date(
                    oldestRecent.getTime() +
                    30 *
                    24 *
                    60 *
                    60 *
                    1000
                )

            return res.status(400).json({
                message:
                    `You can only change your username twice in a month. Next change available on ${nextAvailable.toLocaleDateString(
                        undefined,
                        {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                        }
                    )}.`
            })
        }

        const existingUser =
            await userModel.findOne({
                username: newUsername,
                _id: {
                    $ne: user._id
                }
            })

        if (existingUser) {
            return res.status(400).json({
                message:
                    "This username is already taken. Please choose another."
            })
        }

        user.username =
            newUsername

        if (
            !Array.isArray(
                user.usernameUpdates
            )
        ) {
            user.usernameUpdates = []
        }

        user.usernameUpdates.push(
            new Date()
        )

        await user.save()

        const updatedRecent =
            user.usernameUpdates.filter(
                (date) =>
                    new Date(date) >
                    thirtyDaysAgo
            )

        res.status(200).json({
            message:
                "Username updated successfully!",

            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                usernameUpdatesCount:
                    updatedRecent.length,
                remainingUpdates:
                    Math.max(
                        0,
                        2 -
                        updatedRecent.length
                    )
            }
        })

    } catch (error) {
        console.error(
            "Username update error:",
            error
        )

        res.status(500).json({
            message:
                "Something went wrong while updating username"
        })
    }
}


module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    updateUsernameController
}
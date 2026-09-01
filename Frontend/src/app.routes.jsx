import { createBrowserRouter } from "react-router"

import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import Profile from "./features/auth/pages/Profile"

import Protected from "./components/Protected"
import AppLayout from "./components/AppLayout"

import Home from "./features/interview/pages/Home"
import Interview from "./features/interview/pages/Interview"

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },

    {
        path: "/register",
        element: <Register />
    },

    {
        path: "/",
        element: (
            <Protected>
                <AppLayout />
            </Protected>
        ),
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "interview/:interviewId",
                element: <Interview />
            },
            {
                path: "profile",
                element: <Profile />
            }
        ]
    }
])
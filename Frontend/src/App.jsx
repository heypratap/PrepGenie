import {
    RouterProvider
} from "react-router"

import {
    router
} from "./app.routes"

import {
    InterviewProvider
} from "./features/interview/interview.provider"

import "./styles/global.css"
import "./styles/layout.css"

function App() {
    return (
        <InterviewProvider>
            <RouterProvider
                router={router}
            />
        </InterviewProvider>
    )
}

export default App
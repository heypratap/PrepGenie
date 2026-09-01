import {
    Navigate
} from "react-router"

import {
    useAuth
} from "../features/auth/hooks/useAuth"


function Protected({ children }) {
    const {
        loading,
        user
    } = useAuth()


    if (loading) {
        return (
            <main className="loading-screen">
                <h1>Loading PrepGenie...</h1>
            </main>
        )
    }


    if (!user) {
        return <Navigate to="/login" />
    }


    return children
}


export default Protected

import {
    Outlet
} from "react-router"

import Navbar from "./Navbar"


function AppLayout() {

    return (
        <div className="app">

            <div className="app__container">

                <Navbar />

                <Outlet />

            </div>

        </div>
    )
}


export default AppLayout

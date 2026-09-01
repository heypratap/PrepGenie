import {
    useNavigate,
    useLocation
} from "react-router"

import {
    useAuth
} from "../features/auth/hooks/useAuth"

import "./navbar.css"

function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, handleLogout } = useAuth()

    function goHome() {
        navigate("/")
    }

    function goProfile() {
        navigate("/profile")
    }

    function scrollToSection(id) {
        if (location.pathname !== "/") {
            navigate("/")
            setTimeout(() => {
                const element = document.getElementById(id)
                element?.scrollIntoView({ behavior: "smooth" })
            }, 100)
        } else {
            const element = document.getElementById(id)
            element?.scrollIntoView({ behavior: "smooth" })
        }
    }

    return (
        <nav className="navbar">
            <div className="navbar__logo" onClick={goHome} title="PrepGenie Home">
                <img
                    src="/prepgenie-logo.png"
                    alt="PrepGenie"
                    className="navbar__logo-img"
                />
            </div>

            <div className="navbar__links">
                <button
                    className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                    onClick={goHome}
                >
                    Home
                </button>
                <button
                    className="nav-link"
                    onClick={() => scrollToSection("features")}
                >
                    Features
                </button>
                <button
                    className="nav-link"
                    onClick={() => scrollToSection("generator")}
                >
                    Prep AI
                </button>
            </div>

            <div className="navbar__actions">
                {user ? (
                    <div className="navbar__user-group">
                        <button
                            className={`navbar__account ${location.pathname === "/profile" ? "active" : ""}`}
                            onClick={goProfile}
                            title="View your profile"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span className="username">
                                {user.username || "Candidate"}
                            </span>
                        </button>
                        <button
                            className="logout-btn"
                            onClick={handleLogout}
                            title="Sign out"
                        >
                            Sign out
                        </button>
                    </div>
                ) : (
                    <button
                        className="navbar__login-btn"
                        onClick={() => navigate("/login")}
                    >
                        Sign in
                    </button>
                )}
            </div>
        </nav>
    )
}

export default Navbar

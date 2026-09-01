import {
    useState
} from "react"

import {
    useNavigate
} from "react-router"

import {
    useAuth
} from "../hooks/useAuth"

import "./auth.css"

function Register() {
    const navigate = useNavigate()

    const {
        loading,
        handleRegister
    } = useAuth()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(event) {
        event.preventDefault()
        setError("")

        try {
            await handleRegister({
                username: username.trim() || email.split("@")[0],
                email,
                password
            })
            navigate("/")
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to create account. Please try again."
            )
        }
    }

    return (
        <main className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <img
                        src="/prepgenie-logo.png"
                        alt="PrepGenie Logo"
                        className="auth-logo-img"
                    />
                </div>

                <header className="auth-header">
                    <h1>Create an account</h1>
                    <p>Start preparing smarter for your dream tech interview.</p>
                </header>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email address</label>
                        <input
                            className="auth-input"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Username (optional)</label>
                        <input
                            className="auth-input"
                            type="text"
                            placeholder="Choose a username or leave empty to use email name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="auth-password-wrapper">
                            <input
                                className="auth-input"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Toggle password visibility"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    {showPassword ? (
                                        <>
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                            <line x1="1" y1="1" x2="23" y2="23"></line>
                                        </>
                                    ) : (
                                        <>
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </>
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {error && <p className="auth-error-msg">{error}</p>}

                    <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Get Started →"}
                    </button>
                </form>

                <footer className="auth-footer">
                    <p>
                        Already have an account?{" "}
                        <button
                            type="button"
                            className="auth-switch-btn"
                            onClick={() => navigate("/login")}
                        >
                            Sign in
                        </button>
                    </p>
                </footer>
            </div>
        </main>
    )
}

export default Register
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

function Login() {
    const navigate = useNavigate()

    const {
        loading,
        handleLogin
    } = useAuth()

    const [identifier, setIdentifier] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(event) {
        event.preventDefault()
        setError("")

        try {
            await handleLogin({
                email: identifier,
                identifier,
                password
            })
            navigate("/")
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to login. Please check your credentials."
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
                    <h1>Welcome back</h1>
                    <p>Enter your username or email to access your interview plans.</p>
                </header>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username or Email</label>
                        <input
                            className="auth-input"
                            type="text"
                            placeholder="Enter your username or email"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="auth-password-wrapper">
                            <input
                                className="auth-input"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
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
                        {loading ? "Signing in..." : "Sign in →"}
                    </button>
                </form>

                <footer className="auth-footer">
                    <p>
                        Don't have an account?{" "}
                        <button
                            type="button"
                            className="auth-switch-btn"
                            onClick={() => navigate("/register")}
                        >
                            Create one
                        </button>
                    </p>
                </footer>
            </div>
        </main>
    )
}

export default Login
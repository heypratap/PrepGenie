import {
    useCallback,
    useEffect,
    useState
} from "react"

import {
    login,
    register,
    logout,
    getMe,
    updateUsername
} from "./services/auth.api"

import {
    AuthContext
} from "./auth.context"

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const checkAuth = useCallback(async () => {
        try {
            const response = await getMe()
            setUser(response?.user || null)
            return response?.user || null
        } catch {
            setUser(null)
            return null
        } finally {
            setLoading(false)
        }
    }, [])

    async function handleLogin({ email, password, identifier }) {
        const response = await login({
            email,
            password,
            identifier
        })

        setUser(response?.user || null)
        return response
    }

    async function handleRegister({ username, email, password }) {
        const response = await register({
            username,
            email,
            password
        })

        setUser(response?.user || null)
        return response
    }

    async function handleLogout() {
        try {
            await logout()
        } finally {
            setUser(null)
        }
    }

    async function handleUpdateUsername(newUsername) {
        const response = await updateUsername({
            username: newUsername
        })

        if (response?.user) {
            setUser(response.user)
        }

        return response
    }

    useEffect(() => {
        let isMounted = true

        async function initAuth() {
            try {
                const response = await getMe()
                if (isMounted) {
                    setUser(response?.user || null)
                }
            } catch {
                if (isMounted) {
                    setUser(null)
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        initAuth()

        return () => {
            isMounted = false
        }
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                setUser,
                setLoading,
                handleLogin,
                handleRegister,
                handleLogout,
                handleUpdateUsername,
                checkAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
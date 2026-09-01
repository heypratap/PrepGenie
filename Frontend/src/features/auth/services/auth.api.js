import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export async function register({
    username,
    email,
    password
}) {
    const response = await api.post(
        "/api/auth/register",
        {
            username: username || email.split("@")[0],
            email,
            password
        }
    )

    return response.data
}

export async function login({
    email,
    username,
    identifier,
    password
}) {
    const userIdentifier = identifier || email || username

    const response = await api.post(
        "/api/auth/login",
        {
            identifier: userIdentifier,
            email: userIdentifier,
            password
        }
    )

    return response.data
}

export async function logout() {
    const response = await api.get(
        "/api/auth/logout"
    )

    return response.data
}

export async function getMe() {
    const response = await api.get(
        "/api/auth/get-me"
    )

    return response.data
}

export async function updateUsername({ username }) {
    const response = await api.patch(
        "/api/auth/update-username",
        {
            username
        }
    )

    return response.data
}
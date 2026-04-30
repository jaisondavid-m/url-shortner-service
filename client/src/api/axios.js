import axios from "axios"

const baseURL = import.meta.env.VITE_API_URL

console.log(baseURL)

const api = axios.create({
    // baseURL: baseURL,
    baseURL: "https://url-shortner-service-jjjx.onrender.com/api",
    withCredentials: true,
    headers: {
        "Content-Type":"application/json"
    }
})

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token")

    if (token) {
        config.headers.Authorization = token
    }

    return config
})

export default api
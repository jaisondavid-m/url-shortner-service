import axios from "axios"

const baseURL = import.meta.env.VITE_API_URL

console.log(baseURL)

const api = axios.create({
    // baseURL: baseURL,
    baseURL: "http://localhost:8000/api",
    withCredentials: true,
    headers: {
        "Content-Type":"application/json"
    }
})

export default api
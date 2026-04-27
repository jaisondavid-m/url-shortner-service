import { createContext , useContext , useEffect , useState } from "react"
import api from "../api/axios.js"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const token = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")

        if (token && storedUser) {
            setUser(JSON.parse(storedUser))
        }

        setLoading(false)

    },[])

    const isAuthenticated = !!user

    const saveAuth = (data) => {
        localStorage.setItem("token",data.token)
        localStorage.setItem("user",JSON.stringify(data.user))
        setUser(data.user)
    }

    const register = async (name,email,password) => {
        try {
            const res = await api.post("/auth/register",{
                name,
                email,
                password,
            })
            saveAuth(res.data)
            return { success: true }
        } catch (err) {
            return {
                success:false,
                message: err.response?.data?.message || "Register failed"
            }
        }        
    }

    const login = async (email,password) => {
        try {
            const res = await api.post("/auth/login",{
                email,
                password,
            })
            saveAuth(res.data)
            return { success: true }
        } catch (err) {
            return {
                success:false,
                message: err.response?.data?.message || "Login Failed"
            }
        }
    }

    const googleLogin = async (token) => {
        try {
            const res = await api.post("/auth/google",{
                token
            })
            saveAuth(res.data)
            return { success: true }
        } catch (err) {
            return {
                success: false,
                message: "Google Login Failed"
            }
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{ user , loading , login , register , googleLogin , logout , isAuthenticated }}
        >
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => useContext(AuthContext)
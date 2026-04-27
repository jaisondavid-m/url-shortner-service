import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../context/AuthContext.jsx"
import { useNavigate } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
import Loading from "../components/Loading.jsx"
import { FaLink } from "react-icons/fa"

function Auth() {

    const { login, register, googleLogin } = useAuth()
    const navigate = useNavigate()

    const [tab, setTab] = useState("login")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        let res
        if (tab === "login") {
            res = await login(form.email, form.password)
        } else {
            res = await register(form.name, form.email, form.password)
        }
        setLoading(false)
        if (res.success) {
            navigate("/home")
        } else {
            setError(res.message)
        }
    }

    // if (loading) return <Loading/>

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F5F2]">
            <div className="flex flex-col items-center mb-6">
                <FaLink className="text-[#5C3A21] text-4xl mb-2"/>
                <h1 className="text-3xl font-bol text-[#5C3A21]">
                    URL Shortner
                </h1>
                <p className="text-sm text-gray-500">
                    Shorten • Share • Track
                </p>
            </div>
            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
                <div className="flex mb-6 border-b">
                    <button
                        onClick={() => setTab("login")}
                        className={`flex-1 pb-2 font-semibold ${tab === "login"
                            ? "text-chocolate border-b-2 border-chocolate"
                            : "text-gray-400"
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setTab("register")}
                        className={`flex-1 pb-2 font-semibold ${tab === "register"
                            ? "text-chocolate border-b-2 border-chocolate"
                            : "text-gray-400"
                            }`}
                    >
                        Register
                    </button>
                </div>
                <h2 className="text-2xl font-bold text-center text-chocolate mb-4">
                    {tab === "login" ? "welcome Back" : "Create Account"}
                </h2>
                {error && (
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                )}
                <AnimatePresence mode="wait">
                    <motion.form
                        key={tab}
                        onSubmit={handleSubmit}
                        className="space-y-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                    >
                        <AnimatePresence>
                            {tab === "register" && (
                                <motion.input
                                    key="name"
                                    name="name"
                                    placeholder="Enter Your Name"
                                    onChange={handleChange}
                                    className="input"
                                    required
                                    initial={{ height: 0 , opacity: 0 }}
                                    animate={{ height: "auto" , opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                />
                            )}
                        </AnimatePresence>

                        <input
                            name="email"
                            type="email"
                            placeholder="Enter Your Email"
                            onChange={handleChange}
                            className="input"
                            required
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder={tab === "login" ? "Enter the password" : "Set the password"}
                            onChange={handleChange}
                            className="input"
                            required
                        />
                        <button
                            disabled={loading}
                            className="btn"
                        >
                            {loading
                                ? "Please wait..."
                                : tab === "login"
                                    ? "Login"
                                    : "Register"
                            }
                        </button>
                    </motion.form>
                </AnimatePresence>

                <div className="my-6 flex items-center">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="px-3 text-gray-400 text-sm">OR</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>
                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            const res = await googleLogin(credentialResponse.credential)
                            if (res.success) {
                                navigate("/home")
                            } else {
                                setError("Google Login Failed")
                            }
                        }}
                        onError={() => setError("Google Login Failed")}
                    />
                </div>
            </div>
        </div>
    )

}

export default Auth
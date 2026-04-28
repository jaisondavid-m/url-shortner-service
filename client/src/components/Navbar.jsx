import React, { useState } from "react"
import { FaLink, FaHome, FaPlus, FaSignOutAlt, FaRandom, FaKeyboard, FaUser, FaExternalLinkAlt, FaList } from "react-icons/fa"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

function Navbar() {

    const navigate = useNavigate()
    const location = useLocation()
    const { logout, user } = useAuth()
    const [showLogoutModal, setShowLogoutModal] = useState(false)

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    const goToTab = (tab) => {
        navigate(`/home?tab=${tab}`)
    }

    return (
        <nav className="w-full sticky top-0 bg-[#F8F5F2] border-b border-[#E8DED6] px-6 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/home")}>
                <FaLink className="text-[#5C3A21] text-xl" />
                <h1 className="text-[#5C3A21] font-bold text-lg">
                    URL Shortener
                </h1>
            </div>
            <div className="flex items-center gap-6 text-sm font-medium">
                <button
                    onClick={() => goToTab("random")}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#5C3A21] transition"
                >
                    <FaRandom />
                    Random
                </button>
                <button
                    onClick={() => goToTab("custom")}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#5C3A21] transition"
                >
                    <FaKeyboard />
                    Custom
                </button>
                <button
                    onClick={() => navigate("/expand")}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#5C3A21] transition"
                >
                    <FaExternalLinkAlt />
                    Expand URL
                </button>
                <button
                    onClick={() => navigate("/myurls")}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#5C3A21] transition"
                >
                    <FaList/>
                    My URLs
                </button>
                <button
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#5C3A21] transition"
                >
                    <FaUser className="" />
                    Profile
                </button>
            </div>
            <div className="flex items-center gap-4">
                {user && (
                    <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                        <img
                            src={user.avatar || "https://ui-avatars.com/api/?name=User"}
                            className="w-8 h-8 rounded-full border"
                        />
                        <span>{user.name}</span>
                    </div>
                )}
                <button
                    onClick={() => setShowLogoutModal(true)}
                    className="flex items-center gap-2 bg-[#5C3A21] text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                >
                    <FaSignOutAlt />
                    Logout
                </button>
            </div>
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center zz-50">
                    <div className="bg-[#F8F5F2] rounded-lg shadow-lg p-6 w-[90%] max-w-sm border border-[#E8DED6]">
                        <h2 className="text-lg font-semibold text-[#5C3A21] mb-2">
                            Confirm Logout
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Are you sure you want to logout ?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowLogoutModal(false)
                                    handleLogout()
                                }}
                                className="px-4 py-2 rounded-lg bg-[#5C3A21] text-white hover:opacity-90 transition cursor-pointer"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )

}

export default Navbar
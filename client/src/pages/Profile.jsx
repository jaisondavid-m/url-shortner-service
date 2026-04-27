import React , { useState } from "react"
import { useAuth } from "../context/AuthContext.jsx"
import { FaUser , FaEnvelope , FaShieldAlt , FaLink } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

function Profile() {

    const navigate = useNavigate()
    const { user , logout } = useAuth()
    const [showLogoutModal, setShowLogoutModal] = useState(false)

    const handelLogout = () => {
        logout()
        navigate("/")
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#F8F5F2] p-6">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 border border-[#E8DED6]">
                <div className="flex items-center gap-4 mb-6">
                    <img
                        src={user?.avatar || "https://ui-avatars.com/api/?name=User"}
                        className="w-16 h-16 rounded-full border"
                    />
                    <div className="">
                        <h1 className="text-xl font-bold text-[#5C3A21]">
                            {user?.name}
                        </h1>
                        <p className="text-sm text-gray-500 capitalize">
                            @{user?.role || "user"}
                        </p>
                    </div>
                </div>
                <div className="p-4 rounded-lg bg-[#F8F5F2] border border-[#E8DED6] flex items-center gap-3">
                    <FaUser className="text-[#5C3A21]"/>
                    <div>
                        <p className="text-xs text-gray-500">User ID</p>
                        <p className="font-semibold text-[#5C3A21]">
                            {user?.ID}
                        </p>
                    </div>
                </div>
                <div className="p-4 rounded-lg bg-[#F8F5F2] border border-[#E8DED6] flex items-center gap-3">
                    <FaEnvelope className="text-[#5C3A21]"/>
                    <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-semibold text-[#5C3A21] break-all">
                            {user?.email}
                        </p>
                    </div>
                </div>
                <div className="p-4 rounded-lg bg-[#F8F5F2] border border-[#E8DED6] flex items-center gap-3">
                    <FaShieldAlt className="text-[#5C3A21]"/>
                    <div>
                        <p className="text-xs text-gray-500">Role</p>
                        <p className="font-semibold text-[#5C3A21]">
                            {user?.role}
                        </p>
                    </div>
                </div>
                <div className="p-4 rounded-lg bg-[#F8F5F2] border border-[#E8DED6] flex items-center gap-3">
                    <FaLink className="text-[#5C3A21]"/>
                    <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <p className="font-semibold text-green-600">
                            {user?.is_active ? "Active" : "Inactive"}
                        </p>
                    </div>
                </div>
                <div>
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full mt-6 bg-red-500 text-white py-3 rounded-lg hover:opacity-90 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
            <div className="mt-6 text-xs text-gray-400 text-center">
                Built with URL shortener System • Clean Auth flow
            </div>
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-sm border border-[#E8DED6]">
                        <h2 className="text-lg font-bold text-[#5C3A21] mb-2">
                            Confirm Logout
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Are you sure you want to logout ?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowLogoutModal(false)
                                    handelLogout()
                                }}
                                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:opacity-90"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

}

export default Profile
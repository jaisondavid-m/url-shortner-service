import React , { useState } from "react"
import {
    FaLink,
    FaBars,
    FaTimes,
    FaUsers,
    FaSignOutAlt,
    FaUserShield,
} from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

function ResponsiveNavbar() {

    const navigate = useNavigate()
    const { logout , user } = useAuth()
    const [menuOpen, setMenuOpen] = useState(false)
    const [showLogoutModal, setShowLogoutModal] = useState(false)

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    const NavItem = ({ label , onClick }) => (
        <button
            onClick={() => {
                onclick()
                setMenuOpen(false)
            }}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-[#F1EAE4] rounded-lg"
        >
            {label}
        </button>
    )

    return (
        <>
            <nav className="w-full sticky-0 top-0 z-50 bg-white border-b px-6 py-3 flex items-center justify-between">
                <div
                    onClick={() => navigate("/home")}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <FaLink className="text-[#5C3A21]" />
                    <h1 className="font-semibold text-[#5C3A21]">Shortener</h1>
                </div>
                <div className="hidden md:flex items-center gap-6 text-sm">
                    <button onClick={() => navigate("/home?tab=random")} className="cursor-pointer">Random</button>
                    <button onClick={() => navigate("/home?tab=custom")} className="cursor-pointer">Custom</button>
                    <button onClick={() => navigate("/expand")} className="cursor-pointer">Expand</button>
                    <button className="cursor-pointer" onClick={() => navigate("/myurls")}>My URLs</button>
                    {user?.role === "admin" && (
                        <button onClick={() => navigate("/admin")} className="cursor-pointer">Admin</button>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 text-sm">
                        <img
                            src={user?.avatar || "https://ui-avatars.com/api/?name=User"}
                            className="w-8 h-8 rounded-full"
                        />
                        <span>{user?.name}</span>
                    </div>
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="hidden md:flex items-center gap-2 bg-[#5C3A21] text-white px-3 py-1.5 rounded-lg"
                    >
                        <FaSignOutAlt/>
                    </button>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden text-xl"
                    >
                        {menuOpen ? <FaTimes/> : <FaBars/>}
                    </button>
                </div>
            </nav>
            {menuOpen && (
                <div className="md:hidden bg-white border=b px-4 py-3 space-y-2">
                    <NavItem label="Random" onClick={() => navigate("/home?tab=random")} />
                    <NavItem label="Custom" onClick={() => navigate("/home?tab=custom")} />
                    <NavItem label="Expand URL" onClick={() => navigate("/expand")} />
                    <NavItem label="My URLs" onClick={() => navigate("/myurls")} />
                    <NavItem label="Profile" onClick={() => navigate("/profile")} />
                    {user?.role === "admin" && (
                        <NavItem label="Admin" onClick={() => navigate("/admin")} />
                    )}
                    <hr/>
                    <NavItem label="Logout" onClick={() => setShowLogoutModal(true)}/>
                </div>
            )}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[90%] max-w-sm">
                        <h2 className="font-semibold mb-2">Confirm Logout</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Are you sure you want to logout ?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-[#5C3A21] text-white px-4 py-1.5 rounded"
                            >
                                LogOut
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )

}

export default ResponsiveNavbar
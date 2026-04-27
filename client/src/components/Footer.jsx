import React from "react"
import { FaLink , FaGithub , FaLinkedin , FaEnvelope } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

function Footer() {

    const navigate = useNavigate()

    return (
        <footer className="w-full bg-[#F8F5F2] border-t border-[#E8DED6]">
            <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/home")}>
                    <FaLink className="text-[#5C3A21] text-xl"/>
                    <h1 className="text-[#5C3A21] font-bold text-lg">
                        URL Shortener
                    </h1>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                    <button
                        onClick={() => navigate("/home?tab=random")}
                        className="hover:text-[#5C3A21] transition"
                    >
                        Random
                    </button>
                    <button
                        onClick={() => navigate("/home?tab=custom")}
                        className="hover:text-[#5C3A21] transition"
                    >
                        Custom
                    </button>
                    <button
                        onClick={() => navigate("/home")}
                        className="hover:text-[#5C3A21] transition"
                    >
                        Home
                    </button>
                </div>
                <div className="flex items-center gap-4 text-[#5C3A21]">
                    <a href="https://github.com/jaisondavid-m" target="_blank" rel="noreferrer">
                        <FaGithub className="hover:scale-105 transition"/>
                    </a>
                    <a href="mailto:jaisondavidm.cs25@bitsathy.ac.in" target="_blank" rel="noreferrer">
                        <FaEnvelope className="hover:scale-105 transition"/>
                    </a>
                    <a href="https://linkedin.com/jaison-david-m-a14072360" target="_blank" rel="noreferrer">
                        <FaLinkedin className="hover:scale-105 transition"/>
                    </a>
                </div>
            </div>
            <div className="text-center text-xs text-gray-400 pb-4">
                &copy; {new Date().getFullYear()} URL Shortener Service • Built with Love
            </div>
        </footer>
    )

}

export default Footer
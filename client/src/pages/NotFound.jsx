import React from "react"
import { useNavigate } from "react-router-dom"
import { FaLink , FaHome , FaSearch } from "react-icons/fa"

function NotFound() {

    const navigate = useNavigate()

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-[#F8F5F2]">
            <div className="text-center max-w-lg space-y-6">
                <div className="flex justify-center">
                    <div className="bg-[#5C3A21]/10 p-6 rounded-full">
                        <FaLink className="text-4xl text-[#5C3A21]" />
                    </div>
                </div>
                <h1 className="text-6xl font-bold text-[#5C3A21]">
                    404
                </h1>
                <h2 className="text-xl font-semibold text-gray-700">
                    This link got lost
                </h2>
                <p className="text-gray-500 text-sm">
                    The page you're looking for doesn't exist or may have been shortened into oblivion.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <button
                        onClick={() => navigate("/home")}
                        className="flex items-center justify-center gap-2 px-5 py-2 bg-[#5C3A21] text-white rounded-lg hover:opacity-90"
                    >
                        <FaHome/>
                        Go Home
                    </button>
                    <button
                        onClick={() => navigate("/expand")}
                        className="flex items-center justify-center gap-2 px-5 py-2 border border-[#5C3A21] text-[#5C3A21] rounded-lg hover:bg-[#5C3A21]/10"
                    >
                        <FaSearch/>
                        Expand URL
                    </button>
                </div>
                <p className="text-xs text-gray-400 pt-4">
                    MayBe the link expired... or never existed
                </p>
            </div>
        </div>
    )

}

export default NotFound
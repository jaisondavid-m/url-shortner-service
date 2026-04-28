import React , { useState } from "react"
import api from "../api/axios.js"


function RandomShortCode() {

    const [url, setUrl] = useState("")
    const [result, setResult] = useState("")
    const [loading, setLoading] = useState(false)
    const [showCopyModal, setShowCopyModal] = useState(false)
    const [password, setPassword] = useState("")
    const [usePassword, setUsePassword] = useState(false)

    const handleSubmit = async () => {
        setLoading(true)
        setResult("")
        try {
            const endpoint = usePassword ? "/protected" : "/shorten"
            const payload = usePassword
                ? { original_url: url, password }
                : { original_url: url }
            // const res = await api.post("/shorten",{
            //     original_url: url
            // })
            const res = await api.post(endpoint,payload)
            setResult(res.data.short_url)
        } catch(err) {
            setResult(err?.response?.data?.message || "Error creating link")
        }
        setLoading(false)
    }
    
    return (
        <div className="space-y-4">
            <input
                placeholder="Enter the long URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="input"
            />
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={usePassword}
                    onChange={() => setUsePassword(!usePassword)}
                />
                <label className="text-sm">Password Protect</label>
            </div>
            {usePassword && (
                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                />
            )}
            <button
                onClick={handleSubmit}
                className="btn"
            >
                {loading ? "Generating..." : "Generate Short Link"}
            </button>
            {result && (
                <div className="p-4 bg-[#F8F5F2] rounded-xl text-[#5C3A21] border border-[#E8DED6] space-y-3">
                    <p className="text-xs text-gray-500">Your Short URL</p>
                    <div className="flex items-center justify-between gap-2">
                        <span className="break-all text-sm font-medium">
                            {result}
                        </span>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(result)
                                setShowCopyModal(true)
                            }}
                            className="px-3 py-1 text-sm bg-[#5C3A21] text-white rounded-lg hover:opacity-90 transition"
                        >
                            Copy
                        </button>
                    </div>
                    <p className="text-xs text-green-600">
                        Random short link generated succesfully
                    </p>
                </div>
            )}
            {showCopyModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-[#E8DED6] w-[90%] max-w-sm text-center space-y-4">
                        <div className="text-green-600 text-3xl">✔</div>
                        <h2 className="text-lg font-semibold text-[#5C3A21]">
                            Copied Successfully
                        </h2>
                        <p className="text-sm text-gray-500">
                            Short URL copied to Clipboard
                        </p>
                        <button
                            onClick={() => setShowCopyModal(false)}
                            className="px-4 py-2 bg-[#5C3A21] text-white rounded-lg hover:opacity-90 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RandomShortCode
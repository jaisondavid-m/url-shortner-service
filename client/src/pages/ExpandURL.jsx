import React, { useState } from "react"
import api from "../api/axios.js"

function ExpandURL() {

    const [inputUrl, setInputUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState("")

    const handleExpand = async () => {

        if (!inputUrl) return

        setLoading(true)
        setResult(null)
        setError("")

        try {
            const res = await api.get("/expand", {
                params: {
                    url: inputUrl,
                }
            })
            setResult(res.data)
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to Expand URL")
        }
        setLoading(false)
    }

    const handleClear = () => {
        setInputUrl("")
        setResult(null)
        setError("")
    }

    return (
        <div className="w-full flex items-center justify-center bg-[#F8F5F2] flex-1">
            <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-lg space-y-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#5C3A21]">
                        URL Expander
                    </h1>
                </div>
                <p className="text-sm text-gray-500">
                    Paste a short URL to get the original destination
                </p>
                <input
                    className="input"
                    placeholder="Paste Short URL (e.g. https://tinyurl.com/xyz)"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                />
                <div className="flex gap-2">
                    <button
                        onClick={handleExpand}
                        disabled={!inputUrl || loading}
                        className="btn flex-1"
                    >
                        {loading ? "Expanding..." : "Expand URL"}
                    </button>
                    <button
                        onClick={handleClear}
                        className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-100"
                    >
                        Clear
                    </button>
                    
                </div>
                {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}
                    {result && (
                        <div className="bg-[#F8F5F2] border border-[#E8DED6] p-4 rounded-xl space-y-3">
                            <div>
                                <p className="text-xs text-gray-500">Original Input</p>
                                <p className="text-sm break-all">{result.original}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Final URL</p>
                                <p className="text-sm font-medium text-[#5C3A21] break-all">
                                    {result.final}
                                </p>
                            </div>
                            <button
                                onClick={() => navigator.clipboard.writeText(result.final)}
                                className="w-full bg-[#5C3A21] text-white py-2 rounded-lg hover:opacity-90"
                            >
                                Copy Final URL
                            </button>
                        </div>
                    )}
            </div>

        </div>
    )

}

export default ExpandURL
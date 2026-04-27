import React, { useState, useRef } from "react"
import api from "../api/axios.js"

function CustomShortCode() {

    const [url, setUrl] = useState("")
    // const [customCode, setCustomCode] = useState("")
    const [result, setResult] = useState("")
    const [loading, setLoading] = useState(false)
    const [code, setCode] = useState("")
    const [exists, setExists] = useState(null)
    const [showCopyModal, setShowCopyModal] = useState(false)
    const [checking, setChecking] = useState(false)
    const timeoutRef = useRef(null)

    const handleSubmit = async () => {
        // setCode("")
        // setUrl("")
        setLoading(true)
        setResult("")
        try {
            const res = await api.post("/shorten/custom", {
                original_url: url,
                custom_code: code,
            })
            setResult(res.data.short_url)
        } catch (err) {
            setResult(err?.response?.data?.message || "Error creating custom link")
        }
        setLoading(false)
    }

    const handleClear = () => {
        setUrl("")
        setCode("")
        setResult("")
        setExists(null)
        setChecking(false)
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
    }

    const checkAvailability = async (value) => {

        if (!value) return

        setChecking(true)

        try {
            const res = await api.get(`/shortcode/${value}/check`)
            setExists(res.data.exists)
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
            timeoutRef.current = setTimeout(() => {
                setExists(null)
            }, 3000);
        } catch (err) {
            setExists(null)
        }
        setChecking(false)
    }

    return (
        <div className="space-y-4">
            <input
                placeholder="Enter the Long URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="input"
            />
            {/* <input
                placeholder="Enter the custom code (e.g. my-link, pdf-link)"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                className="input"
            /> */}
            <div className="flex items-center input">
                <span className="text-gray-500">http://localhost:8000/</span>
                <input
                    className="flex-1 outline-none ml-1"
                    value={code}
                    onChange={(e) => {
                        const val = e.target.value
                        setCode(val)
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current)
                        }
                        // checkAvailability(val)
                    }}
                    placeholder="your-custom-code"
                />
                <button
                    onClick={() => checkAvailability(code)}
                    className="w-full border border-[#5C3A21] p-2 rounded-lg hover:bg-[#5C3A21] hover:text-white transition cursor-pointer"
                    disabled={!code || checking}
                >
                    {checking ? "Checking..." : "Check Availability"}
                </button>
            </div>
            {code && exists === true && (
                <p className="text-red-500 text-sm">Code Already Taken</p>
            )}
            {code && exists === false && (
                <p className="text-green-600 text-sm">Code Available</p>
            )}
            <button
                onClick={handleSubmit}
                className="btn"
                disabled={
                    loading ||
                    !url ||
                    !code ||
                    exists === true ||
                    checking
                }
            >
                {loading ? "Creating..." : "Create Custom Link"}
            </button>
            <button
                onClick={handleClear}
                className="w-full border border-gray-400 text-gray-600 p-3 rounded-lg hover:bg-gray-100 transition"
            >
                Clear Inputs
            </button>
            {
                result && (
                    <div className="p-4 bg-[#F8F5F2] border border-[#E8DED6] rounded-xl text-[#5C3A21] space-y-3">
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
                            Click copy to save URL to Clipboard
                        </p>
                    </div>

                )
            }
            {showCopyModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-[#E8DED6] w-[90%] max-w-sm text-center space-y-4">
                        <div className="text-green-600 text-2xl">✔</div>
                        <h2 className="text-lg font-semibold text-[#5C3A21]">Copied Successfully</h2>
                        <p className="text-sm text-gray-500">
                            Your short URL has been copied to clipboard.
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

export default CustomShortCode
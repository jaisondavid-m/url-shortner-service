import React , { useState , useRef } from "react"
import api from "../api/axios.js"

function CustomShortCode() {

    const [url,setUrl] = useState("")
    // const [customCode, setCustomCode] = useState("")
    const [result, setResult] = useState("")
    const [loading, setLoading] = useState(false)
    const [code, setCode] = useState("")
    const [exists, setExists] = useState(null)
    const [checking, setChecking] = useState(false)
    const timeoutRef = useRef(null)

    const handleSubmit = async () => {
        setLoading(true)
        setResult("")
        try {
            const res = await api.post("/shorten/custom",{
                original_url: url,
                custom_code: code,
            })
            setResult(res.data.short_url)
        } catch (err) {
            setResult(err?.response?.data?.message || "Error creating custom link")
        }
        setLoading(false)
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
                {loading ? "Craeting" : "Create Custom Link"}
            </button>
            {
                result && (
                    <div className="p-3 bg-[#F8F5F2] rounded-lg text-[#5C3A21] break-all">
                        {result}
                    </div>
                )
            }
        </div>
    )
}

export default CustomShortCode
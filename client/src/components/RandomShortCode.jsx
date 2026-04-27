import React , { useState } from "react"
import api from "../api/axios.js"


function RandomShortCode() {

    const [url, setUrl] = useState("")
    const [result, setResult] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setLoading(true)
        setResult("")
        try {
            const res = await api.post("/shorten",{
                original_url: url
            })
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
            <button
                onClick={handleSubmit}
                className="btn"
            >
                {loading ? "Generating..." : "Generate Short Link"}
            </button>
            {result && (
                <div className="p-3 bg-[#F8F5F2] rounded-lg text-[#5C3A21]">
                    {result}
                </div>
            )}
        </div>
    )
}

export default RandomShortCode
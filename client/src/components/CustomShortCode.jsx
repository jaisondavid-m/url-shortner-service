import React , { useState } from "react"
import api from "../api/axios.js"

function CustomShortCode() {

    const [url,setUrl] = useState("")
    const [customCode, setCustomCode] = useState("")
    const [result, setResult] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setLoading(true)
        setResult("")
        try {
            const res = await api.post("/shorten/custom",{
                original_url: url,
                custom_code: customCode,
            })
            setResult(res.data.short_url)
        } catch (err) {
            setResult(err?.response?.data?.message || "Error creating custom link")
        }
        setLoading(false)
    }

    return (
        <div className="space-y-4">
            <input
                placeholder="Enter the Long URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="input"
            />
            <input
                placeholder="Enter the custom code (e.g. my-link, pdf-link)"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                className="input"
            />
            <button
                onClick={handleSubmit}
                className="btn"
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
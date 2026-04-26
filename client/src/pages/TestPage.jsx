import React , { useEffect , useState } from "react"
import api from "../api/axios.js"

function TestPage() {

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchData = async () => {
        try {
            const res = await api.get("/test")
            setData(res.data)
        } catch (err) {
            setError(err.response?.data || err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchData()
    },[])

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    if (error) {
        return (
            <div>
                Error: {JSON.stringify(error)}
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">API Response</h2>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-y-auto">
                <pre>{JSON.stringify(data,null,2)}</pre>
            </div>
        </div>
    )
}

export default TestPage
import React, { useEffect, useState } from "react"
import api from "../api/axios.js"
import Loading from "../components/Loading.jsx"

function MyURLs() {

    const [urls, setUrls] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [copied, setCopied] = useState("")
    const [showDeletemodal, setShowDeleteModal] = useState(false)
    const [selectedCode, setSelectedCode] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState("")

    useEffect(() => {
        fetchURLs()
    }, [])

    const fetchURLs = async () => {
        try {
            const res = await api.get("/myurls")
            setUrls(res.data.data)
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to fetch URLs")
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = (url) => {

        navigator.clipboard.writeText(url)
        setCopied(url)

        setTimeout(() => {
            setCopied("")
        }, 2000);

    }

    const confirmDelete = async () => {
        setDeleting(true)
        setDeleteError("")
        try {

            await api.delete(`/url/${selectedCode}`)

            setUrls((prev) => prev.filter((u) => u.short_code !== selectedCode))

            setShowDeleteModal(false)
            setSelectedCode(null)
        } catch (err) {
            setDeleteError(err?.response?.data?.message || "Failed to delete the url")
        } finally {
            setDeleting(false)
        }
    }

    const openDeleteModal = (code) => {
        setSelectedCode(code)
        setShowDeleteModal(true)
    }

    return (
        <div className="w-full flex justify-center bg-[#F8F5F2] min-h-screen p-6">
            <div className="w-full max-w-4xl space-y-6">
                <h1 className="text-2xl font-bold text-[#5C3A21]">
                    My URLs
                </h1>
                {loading && (
                    // <p className="text-gray-500">Loading...</p>
                    <Loading/>
                )}
                {error && (
                    <p className="text-red-500">{error}</p>
                )}
                {!loading && urls.length === 0 && (
                    <p className="text-gray-500">
                        No URLs Created yet
                    </p>
                )}
                <div className="space-y-4">
                    {urls.map((item) => {

                        const shortUrl = `http://localhost:8000/${item.short_code}`

                        return (
                            <div
                                key={item.ID}
                                className="bg-white p-4 rounded-xl shadow-md border border-[#E8DED6] space-y-2"
                            >
                                <div className="">
                                    <p className="text-xs text-gray-500">Original</p>
                                    <p className="text-sm break-all">{item.original_url}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Short URL</p>
                                    <p className="text-sm font-medium text-[#5C3A21] break-all">
                                        {shortUrl}
                                    </p>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <p className="text-xs text-gray-500">
                                        Clicks: {item.clicks}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleCopy(shortUrl)}
                                            className="px-3 py-1 bg-[#5C3A21] text-white text-sm rounded-lg hover:opacity-90 cursor-pointer"
                                        >
                                            {copied === shortUrl ? "Copied !" : "Copy"}
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(item.short_code)}
                                            className="px-3 py-1 border border-red-400 text-red-500 text-sm rounded-lg hover:bg-red-50 cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400">
                                    Created: {new Date(item.CreatedAt).toLocaleString()}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
            {showDeletemodal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
                    <div className="bg-white rounded-xl p-6 w-80 text-center shadow-xl space-y-4">
                        <h2 className="text-lg font-semibold text-[#5C3A21]">
                            Delete URL ?
                        </h2>
                        <p className="text-sm text-gray-600">
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-2 justify-center">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleting}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:opacity-90 cursor-pointer"
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                        {deleteError && (
                            <p className="text-red-500 text-sm">{deleteError}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )

}

export default MyURLs
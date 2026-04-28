import React, { useEffect, useState } from "react"
import api from "../api/axios.js"
import Loading from "../components/Loading.jsx"

function AdminPage() {

    const [activeTab, setActiveTab] = useState("users")
    const [users, setUsers] = useState([])
    const [urls, setUrls] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteType, setDeleteType] = useState("")
    const [selectedItem, setSelectedItem] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const fetchUsers = async () => {
        try {
            setLoading(true)
            setError("")
            const res = await api.get("/admin/users")
            setUsers(res.data.users)
        } catch (err) {
            setError("Failed to fetch users")
        } finally {
            setLoading(false)
        }
    }

    const fetchURLs = async () => {
        try {
            setLoading(true)
            setError("")
            const res = await api.get("/admin/urls")
            setUrls(res.data.data)
        } catch (err) {
            setError("Failed to fetch URLs")
        } finally {
            setLoading(false)
        }
    }

    const deleteUser = (user) => {
        setDeleteType("user")
        setSelectedItem(user)
        setShowDeleteModal(true)
    }

    const deleteURL = (url) => {
        setDeleteType("url")
        setSelectedItem(url)
        setShowDeleteModal(true)
    }

    const handleConfirmDelete = async () => {
        try {
            setDeleteLoading(true)
            if (deleteType === "user") {
                await api.delete(`/admin/user/${selectedItem.id}`)
                setUsers(prev => prev.filter(u => u.id !== selectedItem.id))
            } else {
                await api.delete(`/admin/url/${selectedItem.short_code}`)
                setUrls(prev => prev.filter(u => u.short_code !== selectedItem.short_code))
            }
            setShowDeleteModal(false)
            setSelectedItem(null)
        } catch (err) {
            setError("Failed to Delete")
        } finally {
            setDeleteLoading(false)
        }
    }

    useEffect(() => {
        if (activeTab === "users") {
            fetchUsers()
        } else {
            fetchURLs()
        }
    }, [activeTab])

    return (
        <div className="min-h-screen bg-[#F8F5F2] p-6">
            <div className="w-full mx-auto bg-white rounded-2xl shadow-lg p-6">
                <h1 className="text-2xl font-bold text-[#5C3A21] mb-6">
                    Admin Dashbord
                </h1>
                <div className="flex border-b mb-6">
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`px-4 py-2 font-medium ${activeTab === "users"
                            ? "border-b-2 border-[#5C3A21] text-[#5C3A21]"
                            : "text-gray-500"
                            }`}
                    >
                        Users
                    </button>
                    <button
                        onClick={() => setActiveTab("urls")}
                        className={`px-4 py-2 font-medium ${activeTab === "urls"
                            ? "border-b-2 border-[#5C3A21] text-[#5C3A21]"
                            : "text-gray-500"
                            }`}
                    >
                        URLs
                    </button>
                </div>
                {loading && (
                    <Loading />
                )}
                {error && (
                    <p className="text-red-500">{error}</p>
                )}
                {activeTab === "users" && !loading && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border rounded-lg overflow-hidden">
                            <thead className="bg-[#F8F5F2] text-left">
                                <tr>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Role</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Created</th>
                                    <th className="p-3 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center p-4 text-gray-500">
                                            No Users Found
                                        </td>
                                    </tr>
                                ) : (users.map((u) => (
                                    <tr
                                        key={u.id}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="p-3 flex items-center gap-2">
                                            <img
                                                src={u.avatar || "https://via.placeholder.com/30"}
                                                alt=""
                                                className="w-8 h-8 rounded-full"
                                            />
                                            {u.name}
                                        </td>
                                        <td className="p-3">{u.email}</td>
                                        <td className="p-3 capitalize">{u.role}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 text-xs rounded-md ${u.is_active
                                                ? "bg-green-100 text-green-600"
                                                : "bg-red-100 text-red-600"
                                                }`}>
                                                {u.is_active ? "Active" : "InActive"}
                                            </span>
                                        </td>
                                        <td className="p-3">{u.created_at}</td>
                                        <td className="p-3 text-center">
                                            <button
                                                onClick={() => deleteUser(u)}
                                                disabled={deleteLoading}
                                                className="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600"
                                            >
                                                {deleteLoading ? "Deleting..." :"Delete"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                {activeTab === "urls" && !loading && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border rounded-lg overflow-hidden">
                            <thead className="bg-[#F8F5F2] text-left">
                                <tr>
                                    <th className="p-3">Short</th>
                                    <th className="p-3">Original</th>
                                    <th className="p-3">User ID</th>
                                    <th className="p-3">Clicks</th>
                                    <th className="p-3">Created</th>
                                    <th className="p-3 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {urls.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center p-4 text-gray-500" >
                                            No URLs Found
                                        </td>  
                                    </tr>
                                ) : (
                                    urls.map((u) => (
                                        <tr
                                            key={u.id}
                                            className="border-t hover:bg-gray-50"
                                        >
                                            <td className="p-3 text-[#5C3A21] font-medium">
                                                {u.short_code}
                                            </td>
                                            <td className="p-3 max-w-xs truncate">
                                                {u.original_url}
                                            </td>
                                            <td className="p-3">{u.user_id}</td>
                                            <td className="p-3">{u.clicks}</td>
                                            <td className="p-3">{u.created_at}</td>
                                            <td className="p-3 text-center">
                                                <button
                                                    onClick={() => deleteURL(u)}
                                                    disabled={deleteLoading}
                                                    className="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600"
                                                >
                                                    { deleteLoading ? "Deleting..." : "Delete"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm shadow-lg space-y-4">
                        <h2 className="text-lg font-semibold text-[#5C3A21]">Confirm Delete</h2>
                        <p className="text-sm text-gray-600">
                            Are you sure want to delete this {deleteType} ?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={deleteLoading}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                {deleteLoading ? "Deleting..." : "Delete" }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminPage
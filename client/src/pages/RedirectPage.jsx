import React , { useEffect , useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axios.js"
import Loading from "../components/Loading.jsx"

function RedirectPage() {

    const { code } = useParams()
    const [protectedLink, setProtectedLink] = useState(false)
    const [password, setPassword] = useState("")

    useEffect(() => {

    },[])

    const checkLink = async () => {
        try {

            const res = await fetch(`http://localhost:800/${code}`)

            if (res.redirected) {
                window.location.href = res.url
                return
            }

            const data = await res.json()

            if (data.protected) {
                setProtectedLink(true)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleVerify = async () => {
        try {
            const res = await api.post(`/${code}/verify`,{
                password
            })
            window.location.href = res.data.redirect_url
        } catch (err) {
            alert("wrong password")
        }
    }

    if (!protectedLink) return <Loading text="Redirecting..." />

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="p-6 border rounded-xl space-y-4">
                <h2>Enter Password</h2>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
                <button onClick={handleVerify} className="btn">
                    Unlock
                </button>
            </div>
        </div>
    )
}

export default RedirectPage
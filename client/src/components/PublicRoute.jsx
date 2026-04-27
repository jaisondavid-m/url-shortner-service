import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import Loading from "../components/Loading.jsx"

function PublicRoute({ children }) {

    const { isAuthenticated , loading } = useAuth()

    if (loading) {
        return (
            // <div>Loading....</div>
            <Loading/>
        )
    }

    if (isAuthenticated) {
        return <Navigate to="/home" replace />
    }

    return children

}

export default PublicRoute
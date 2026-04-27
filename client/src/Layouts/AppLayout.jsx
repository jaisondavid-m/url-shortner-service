import React from "react"
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"

function AppLayout({ children }) {
    return (
        <div>
            <div className="min-h-screen flex flex-col bg-[#F8F5F2]">
                <Navbar />
                <main className="flex-1 flex">
                    {children}
                </main>
            </div>
            <Footer />
        </div>

    )
}

export default AppLayout
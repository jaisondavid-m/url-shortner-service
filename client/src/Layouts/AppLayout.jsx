import React from "react"
// import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import ResponsiveNavbar from "../components/ResponsiveNavbar.jsx"

function AppLayout({ children }) {
    return (
        <div>
            <div className="min-h-screen flex flex-col bg-[#F8F5F2]">
                {/* <Navbar /> */}
                <ResponsiveNavbar/>
                <main className="flex-1 w-full">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    )
}

export default AppLayout
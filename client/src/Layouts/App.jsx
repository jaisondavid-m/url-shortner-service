import React from "react"
import { BrowserRouter , Routes , Route } from "react-router-dom"
import AppLayout from "./AppLayout.jsx"
import ProtectedRoute from "../components/ProtectedRoute.jsx"
import PublicRoute from "../components/PublicRoute.jsx"
import TestPage from "../pages/TestPage.jsx"
import Auth from "../pages/Auth.jsx"
import Home from "../pages/Home.jsx"

export default function App() {
  return(
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicRoute><Auth/></PublicRoute>}/>
          <Route path="/home" element={
            <ProtectedRoute>
              <AppLayout>
                <Home/>
              </AppLayout>
            </ProtectedRoute>
            } 
          />
          <Route path="/test" element={<TestPage/>} />
        </Routes>
    </BrowserRouter>
  )
}
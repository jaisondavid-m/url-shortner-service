import React from "react"
import { BrowserRouter , Routes , Route } from "react-router-dom"
import TestPage from "../pages/TestPage.jsx"
import Auth from "../pages/Auth.jsx"
import Home from "../pages/Home.jsx"

export default function App() {
  return(
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth/>}/>
          <Route path="/home" element={<Home/>} />
          <Route path="/test" element={<TestPage/>} />
        </Routes>
    </BrowserRouter>
  )
}
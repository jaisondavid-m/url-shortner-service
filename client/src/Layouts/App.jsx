import React from "react"
import { BrowserRouter , Routes , Route } from "react-router-dom"
import TestPage from "../pages/TestPage.jsx"

export default function App() {
  return(
    <BrowserRouter>
        <Routes>
          <Route path="/test" element={<TestPage/>} />
        </Routes>
    </BrowserRouter>
  )
}
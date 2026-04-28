import React from "react"
import { BrowserRouter , Routes , Route } from "react-router-dom"
import AppLayout from "./AppLayout.jsx"
import ProtectedRoute from "../components/ProtectedRoute.jsx"
import PublicRoute from "../components/PublicRoute.jsx"
import TestPage from "../pages/TestPage.jsx"
import Auth from "../pages/Auth.jsx"
import Home from "../pages/Home.jsx"
import Profile from "../pages/Profile.jsx"
import ExpandURL from "../pages/ExpandURL.jsx"
import MyURLs from "../pages/MyURLs.jsx"
import NotFound from "../pages/NotFound.jsx"
import RedirectPage from "../pages/RedirectPage.jsx"

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
          <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Profile/>
                  </AppLayout>
                </ProtectedRoute>
              }
          />
          <Route
              path="/expand"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ExpandURL/>
                  </AppLayout>
                </ProtectedRoute>
              }
          />
          <Route
              path="/myurls"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <MyURLs/>
                  </AppLayout>
                </ProtectedRoute>
              }
          />
          {/* <Route path="/:code" element={<RedirectPage/>} /> */}
          <Route path="/test" element={<TestPage/>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
    </BrowserRouter>
  )
}
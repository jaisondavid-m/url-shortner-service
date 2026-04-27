import React , { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { motion , AnimatePresence } from "framer-motion"
import CustomShortCode from "../components/CustomShortCode"
import RandomShortCode from "../components/RandomShortCode"

function Home() {
    // const [tab, setTab] = useState("random")
    const [searchParams,setSearchParams] = useSearchParams()
    const tab = searchParams.get("tab") || "random"

    const changeTab = (value) => {
        setSearchParams({ tab: value })
    }
    return (
        <div className="w-full flex-1 flex items-center justify-center bg-[#F8F5F2]">
            <div className="w-full max-w-xl">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-[#5C3A21]">URL Shortener</h1>
                    <p className="text-gray-500 text-sm">Create & Manage your short links</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex border-b mb-6">
                        <button
                            onClick={() => changeTab("random")}
                            className={`flex-1 pb-2 font-semibold transition ${
                                tab === "random"
                                    ? "text-[#5C3A21] border-b-2 border-[#5C3A21]"
                                    : "text-gray-400"
                            }`}
                        >
                            Random Code
                        </button>
                        <button
                            onClick={() => changeTab("custom")}
                            className={`flex-1 pb-2 font-semibold transition ${
                                tab === "custom"
                                    ? "text-[#5C3A21] border-b-2 border-[#5C2A21]"
                                    : "text-gray-400"
                            }`}
                        >
                            Custom Code
                        </button>
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={tab}
                            initial={{ opacity: 0 , x: 20 }}
                            animate={{ opacity: 1 , x:0 }}
                            exit={{ opacity: 0 , x: -20 }}
                            transition={{ duration: 0.25 }}
                        >
                            {tab === "random" && <RandomShortCode/> }
                            {tab === "custom" && <CustomShortCode/>}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
            {/* <CustomShortCode/>
            <RandomShortCode/> */}
        </div>
    )
}

export default Home
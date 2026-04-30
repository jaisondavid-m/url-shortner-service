import React , { useState } from "react"
import SectionLabel from "../components/SectionLabel.jsx"
import { gettingStarted } from "../data/gettingStarted.jsx"
import { features } from "../data/features"
import { tabs } from "../data/tabs.js"
import StepItem from "../components/StepItem.jsx"
import { flows } from "../data/flows"
import { terminalLines } from "../data/terminallines.js"

function Info() {

    const [activeTab, setActiveTab] = useState("basic")

    return (
        <div className="w-full flex justify-center bg-[#F8F5F2] min-h-screen p-6">
            <div className="w-full max-w-4xl space-y-10">
                <div>
                    <h1 className="text-2xl font-bold text-[#5CA321] mb-2">
                        How to use URL Shortener
                    </h1>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Turn long links into short, trackable URLs = with custom
                        codes, password protection and click analytics.
                    </p>
                </div>
                <div>
                    <SectionLabel>Getting Started</SectionLabel>
                    <div className="space-y-3">
                        {gettingStarted.map((step,i) => (
                            <StepItem
                                key={i}
                                index={i+1}
                                title={step.title}
                                desc={step.desc}
                            />
                        ))}
                    </div>
                    <div>
                        <SectionLabel>Features</SectionLabel>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {features.map((f,i) => (
                                <div
                                    key={i}
                                    className="bg-white border border-[#E8DED6] rounded-xl p-4"
                                >
                                    <div className={`w-8 h-8 rounded-lg ${f.bg} flex items-center justify-center text-sm mb-3`}>
                                        {f.icon}
                                    </div>
                                    <p className="text-sm font-medium text-[#5C3A21] mb-1">
                                        {f.title}
                                    </p>    
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        {f.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <SectionLabel>WorkFlows</SectionLabel>
                        <div className="flex gap-2 flex-wrap mb-4">
                            {tabs.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTab(t.id)}
                                    className={`text-sm px-4 py-1.5 rounded-lg border cursor-pointer transition-all ${
                                        activeTab === t.id
                                            ? "bg-green-100 text-green-800 border-green-200 font-medium"
                                            : "bg-white text-gray-500 border-[#E8DED6] hover:bg-[#F1EFE8]"
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                        {activeTab !== "terminal" && flows[activeTab] && (
                            <div className="space-y-3">
                                {flows[activeTab].map((step,i) => (
                                    <StepItem
                                        key={i}
                                        index={i+1}
                                        title={step.title}
                                        desc={step.desc}
                                    />
                                ))}
                            </div>
                        )}
                        {activeTab === "terminal" && (
                            <div className="space-y-3">
                                <div className="bg-[#2C2C2A] rounded-xl p-5 font-mono text-sm leading-loose">
                                    {terminalLines.map((line,i) => {
                                        if (line.type === "comment")
                                            return (
                                                <div key={i} className="text-[#888780]">
                                                    {line.text}
                                                </div>
                                        )
                                        if (line.type === "cmd") {
                                            return (
                                                <div key={i} className="text-[#97C459]">
                                                    {line.text}
                                                </div>
                                            )
                                        }
                                        if (line.type === "output")
                                            return (
                                                <div key={i} className="text-[#9FE1CB]">
                                                    {line.text}
                                                </div>
                                        )
                                        return null
                                    })}
                                </div>
                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-700">
                                    Tip: Use ↑ / ↓ arrow keys to cycle through your command history, just lika real terminal.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Info
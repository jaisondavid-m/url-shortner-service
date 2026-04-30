import React from "react"

function SectionLabel({ children }) {
    return (
        <p className="text-xs my-10 font-medium tracking-widest uppercase text-gray-400 mb-3">
            {children}
        </p>
    )
}

export default SectionLabel
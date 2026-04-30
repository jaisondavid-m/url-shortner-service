import React from "react"

function Code({ children }) {
    return (
        <code className="font-mono text-xs bg-[#F1EFE8] border border-[#D3D1c7] rounded px-1 py-0.5 text-[#5C3A21]">
            {children}
        </code>
    )
}

export default Code
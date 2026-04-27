import React from "react"

function Loading({ text="Loading..." }) {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#F8F5F2] z-50">
            <div className="relative w-14 h-14">
                <div className="absoulte inset-0 border-4 border-[#E5D3C2] rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-[#5C3A21] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-[#5C3A21] font-semibold tracking-wide">
                {text}
            </p>
        </div>
    )
}

export default Loading
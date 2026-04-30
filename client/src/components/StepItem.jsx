import React from "react"

function StepItem({ index , title , desc }) {
    return (
        <div className="flex gap-4 bg-white border border-[#E8DED6] rounded-xl p-4">
            <div className="w-7 h-7 rounded-full bg-green-100 text-green-800 text-xs font-medium flex items-center justify-center shrink-0 mt-0.5">
                {index}
            </div>
            <div>
                <p className="text-sm font-medium text-[#E8DED6] rounded-xl p-4">{title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}

export default StepItem
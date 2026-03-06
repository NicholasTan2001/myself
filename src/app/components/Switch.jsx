"use client";

export default function Switch({ isOn, onToggle, disabled = false }) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={() => onToggle(!isOn)}
            className={`w-14 h-7 lg:w-16 lg:h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                } ${isOn ? "bg-green-500 justify-end" : "bg-gray-300 justify-start"}`}
        >
            <div className="w-5 h-5 lg:w-6 lg:h-6 bg-white rounded-full shadow-md transition-all duration-300"></div>
        </button>
    );
}
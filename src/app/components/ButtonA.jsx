"use client";
import React from "react";

export default function ButtonA({ children, className = "", ...props }) {

    {/* Button A (blue-300) */ }
    return (
        <button
            {...props}
            className={`inline-flex items-center justify-center bg-gray-400 text-white font-semibold px-4 py-2 rounded-lg transform transition-all duration-200 ease-out hover:scale-110 hover:bg-blue-300 active:bg-blue-500 ${className}`}
        >
            {children}
        </button>
    );
}

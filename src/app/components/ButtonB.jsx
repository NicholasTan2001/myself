"use client";
import React from "react";

export default function ButtonA({ children, className = "", ...props }) {

    {/* Button B (text-red-300) */ }
    return (
        <button
            {...props}
            className={`inline-flex items-center justify-center bg-gray-400 text-white font-semibold px-4 py-2 rounded-lg transform transition-all duration-200 ease-out hover:scale-110 hover:bg-red-300 active:bg-red-500 cursor-pointer text-sm lg:text-base ${className}`}
        >
            {children}
        </button>
    );
}
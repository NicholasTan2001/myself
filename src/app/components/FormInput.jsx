"use client";
import { useState } from "react";

export default function FormInput({ label, type, name, value, placeholder, onChange }) {
    const [focused, setFocused] = useState(false);

    {/* Form */ }
    return (

        <div className="flex flex-col w-full mb-5">
            <label
                htmlFor={name}
                className={`mb-2 text-left text-sm font-medium transition-colors duration-300 ${focused ? "text-blue-500" : "text-gray-400"
                    }`}
            >
                {label}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                placeholder={placeholder}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={onChange}
                className={`border rounded-xl px-4 py-2 focus:outline-none transition-all duration-300
          ${focused
                        ? "border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        : "border-gray-300"
                    }`}
            />
        </div>
    );
}

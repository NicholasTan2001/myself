"use client";
import { useState } from "react";

export default function FormImportant({ label, type = "text", name, value, placeholder, onChange }) {
    const [focused, setFocused] = useState(false);

    const isSelect = type === "select";
    const days = ["None", "Important"];

    {/* Important Form */ }
    return (
        <div className="flex flex-col w-full mb-5">
            <label
                htmlFor={name}
                className={`mb-2 text-left text-sm font-medium transition-colors duration-300 ${focused ? "text-blue-500" : "text-gray-400"
                    }`}
            >
                {label}
            </label>

            {isSelect ? (
                <div className="relative w-full">
                    <select
                        id={name}
                        name={name}
                        value={value}
                        placeholder="Select a valid day"
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        onChange={onChange}
                        className={`appearance-none w-full border rounded-xl px-4 py-2 pr-10 focus:outline-none transition-all duration-300 ${focused
                            ? "border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            : "border-gray-300"
                            }`}
                    >
                        {days.map((day) => (
                            <option key={day} value={day}>
                                {day}
                            </option>
                        ))}
                    </select>

                    {/* Custom arrow icon */}
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-gray-500 pointer-events-none"></div>
                </div>
            ) : (
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={onChange}
                    className={`appearance-none w-full border rounded-xl px-4 py-2 pr-10 focus:outline-none transition-all duration-300  ${focused
                        ? "border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        : "border-gray-300"
                        }`}
                />
            )
            }
        </div >
    );
}

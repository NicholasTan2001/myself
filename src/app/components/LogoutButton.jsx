"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    {/* Function: submit logout */ }
    const handleLogout = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/logout", { method: "POST" });
            if (res.ok) {
                router.push("/login");
            } else {
                console.error("Logout failed", await res.text());
                setLoading(false);
            }
        } catch (err) {
            console.error("Logout failed", err);
            setLoading(false);
        }
    };

    return (

        <div className="flex justify-end items-center gap-5 w-full">
            {loading && (
                <div className="animate-spin rounded-full h-5 w-5 border-3 border-red-300 border-solid border-t-transparent"></div>
            )}

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                disabled={loading}
                className={`${loading ? "bg-red-300 cursor-not-allowed" : "bg-gray-400 hover:bg-red-300 active:bg-red-500"
                    } text-white font-semibold px-4 py-2 rounded-lg transform transition-all duration-200 ease-out hover:scale-110`}
            >
                {loading ? "Logging out..." : "Logout"}
            </button>
        </div>
    );
}

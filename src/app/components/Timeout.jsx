"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Timeout() {
    const router = useRouter();
    const [showMessage, setShowMessage] = useState(false);

    {/* Effect: 1 hour to refresh the page*/ }
    useEffect(() => {
        const messageTimer = setTimeout(() => setShowMessage(true), 3602000);
        const redirectTimer = setTimeout(() => router.push("/login"), 3605000);

        return () => {
            clearTimeout(messageTimer);
            clearTimeout(redirectTimer);
        };
    }, [router]);

    return (
        <>
            {/* Timeout Page */}
            {showMessage && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-[0_0_25px_rgba(255,255,255,0.8)] text-center">
                        <p className="text-black font-semibold">
                            Your session will expire soon. Redirecting to login session...
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

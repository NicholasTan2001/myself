"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Timeout from "../components/Timeout";
import Loading from "../components/Loading";
import Footer from "../components/Footer";

export default function MyProfilePage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <Navbar />

            <Timeout />

            <div className="text-center mt-10">
                <h1 className="text-2xl font-bold mb-4">Logged in</h1>
                <p className="text-gray-600">Welcome to your My Profile!</p>
            </div>

            <Footer />

        </>
    );
}

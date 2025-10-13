"use client";
import Navbar from "../components/Navbar";
import Timeout from "../components/Timeout";

export default function DashboardPage() {
    return (
        <>
            <Navbar />

            <Timeout />

            <div className="text-center mt-10">
                <h1 className="text-2xl font-bold mb-4">Logged in</h1>
            </div>
        </>
    );
}

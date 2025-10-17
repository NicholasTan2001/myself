"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Timeout from "../components/Timeout";
import Loading from "../components/Loading";
import Footer from "../components/Footer";
import FontA from "../components/FontA";

export default function ModificationPage() {
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

            {/* Title */}
            <motion.div
                className="flex justify-center items-center mt-10"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <div className="bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 text-center w-[70%] lg:w-[800px]">
                    <FontA>
                        <h1 className="text-2xl">Modification</h1>
                    </FontA>
                </div>
            </motion.div>

            <motion.div
                className="flex justify-center items-center mt-10 mb-10"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <div className="bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 text-left w-[80%] lg:w-[1000px]">
                    <h1 className="font-semibold mb-5">To-Do List Modification</h1>
                </div>
            </motion.div>
            <Footer />

        </>
    );
}
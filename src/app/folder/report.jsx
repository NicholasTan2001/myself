"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Timeout from "../components/Timeout";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import FontA from "../components/FontA";
import { motion, AnimatePresence } from "framer-motion";

export default function ReportPage() {

    const [loading, setLoading] = useState(true);

    {/* Effect: loading in 3 seconds */ }
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) return <Loading />;

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
                <div className="bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 text-center w-[70%] lg:w-[50%]">
                    <FontA>
                        <h1 className="text-2xl">Report</h1>
                    </FontA>
                </div>
            </motion.div>

            <div className="flex flex-col justify-center items-center gap-10 mt-10 mb-10 lg:px-20 px-10">
                {/* Tasks History*/}
                <motion.div
                    className="bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 text-left w-full lg:w-[70%]"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <h1 className="font-semibold text-lg">To-Do List History</h1>
                    <h1 className="font-semibold text-lg text-gray-500 mb-5">
                        * History for daily to-do list & special to-do list.
                    </h1>

                </motion.div>
            </div>

            <Footer />
        </>
    );
};
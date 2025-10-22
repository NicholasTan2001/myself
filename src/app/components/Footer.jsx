"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import FontA from "../components/FontA";

export default function Footer() {
    const [showFooter, setShowFooter] = useState(false);

    {/* Effect: Showing footer more smoothly*/ }
    useEffect(() => {
        const timer = setTimeout(() => setShowFooter(true), 100);
        return () => clearTimeout(timer);
    }, []);

    {/* Footer */ }
    return (
        <motion.footer
            initial={{ opacity: 0, y: 50 }}
            animate={showFooter ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="
                left-0 w-full
                bg-white bg-opacity-90 shadow-[0_0_25px_rgba(255,255,255,0.8)]
                text-gray-500 font-semibold tracking-wide text-center py-4
                transition-all duration-700 ease-out
                z-40
            "
        >
            <FontA>
                <p className="text-sm md:text-base">
                    © {new Date().getFullYear()} MySelf. All rights reserved.
                </p>
            </FontA>
        </motion.footer>
    );
}

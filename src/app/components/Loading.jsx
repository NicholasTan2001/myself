"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Loading({ isVisible = true }) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="fixed inset-0 flex items-center justify-center bg-white z-50"
                >
                    <div className="flex flex-col items-center space-y-4">
                        <Image
                            src="/loading.gif"
                            alt="Loading..."
                            width={100}
                            height={100}
                            priority
                            className="rounded-lg"
                        />
                        <p className="text-gray-500 font-semibold text-lg">
                            Loading ... ...
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

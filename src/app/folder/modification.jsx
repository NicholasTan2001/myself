"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Timeout from "../components/Timeout";
import Loading from "../components/Loading";
import Footer from "../components/Footer";
import FontA from "../components/FontA";
import FormInput from "../components/FormInput";
import ButtonA from "../components/ButtonA";
import { useRouter } from 'next/navigation';

export default function ModificationPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [isSpecial, setIsSpecial] = useState(false);
    const [hasEntered, setHasEntered] = useState(false);
    const [formData, setFormData] = useState({ name: "", remark: "" });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setHasEntered(true), 4000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) return <Loading />;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
        setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch("/api/dailylist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "*Failed to add task");

            setMessage("✅ Task added successfully!");
            setFormData({ name: "", remark: "" });

            router.push("/auth/dashboard");

        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />
            <Timeout />

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

            <div className="flex justify-center items-center mt-10 mb-10 perspective-[1500px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isSpecial ? "special" : "daily"}
                        className="relative bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 text-left w-[80%] lg:w-[1000px]"
                        initial={
                            hasEntered
                                ? { opacity: 0, rotateY: isSpecial ? -90 : 90 }
                                : { opacity: 0, y: 50 }
                        }
                        animate={{ opacity: 1, rotateY: 0, y: 0 }}
                        exit={{
                            opacity: 0,
                            rotateY: isSpecial ? -90 : 90,
                        }}
                        transition={
                            hasEntered
                                ? { duration: 0.3, ease: "easeInOut" }
                                : { duration: 1, ease: "easeOut" }
                        }
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        {!isSpecial ? (
                            <button
                                onClick={() => setIsSpecial(true)}
                                className="absolute right-5 top-5 text-gray-300 hover:text-blue-300 transition"
                                title="Switch to Special Tasks"
                            >
                                <ChevronRight size={28} />
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsSpecial(false)}
                                className="absolute left-5 top-5 text-gray-300 hover:text-blue-300 transition"
                                title="Back to Daily Tasks"
                            >
                                <ChevronLeft size={28} />
                            </button>
                        )}

                        <h1 className="font-semibold px-10">
                            New To-Do List Request – {isSpecial ? "Special" : "Daily"}
                        </h1>

                        <p className="text-gray-500 px-10">
                            {isSpecial
                                ? "*Add new special to-do list."
                                : "*Add new daily to-do list."}
                        </p>

                        {isSpecial ? (
                            <p className="text-red-500 px-10 mt-5">Maintaining ... ...</p>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col lg:flex-row lg:gap-6 px-10 mt-5">
                                    <div className="w-full lg:flex-1">
                                        <FormInput
                                            label="Task Name"
                                            type="text"
                                            name="name"
                                            placeholder="Enter your daily task name"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="w-full lg:flex-2">
                                        <FormInput
                                            label="Remark"
                                            type="text"
                                            name="remark"
                                            placeholder="Enter task remark"
                                            value={formData.remark}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {error && <p className="text-red-600 text-left px-10 mb-5">{error}</p>}

                                <div className="px-10 flex justify-end">
                                    <div className="p-3">
                                        {submitting && (
                                            <div className="animate-spin p-2 rounded-full h-5 w-5 border-3 border-blue-300 border-solid border-t-transparent"></div>
                                        )}
                                    </div>

                                    <ButtonA type="submit" disabled={submitting}>
                                        {submitting ? "Adding..." : "Add Task"}
                                    </ButtonA>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <Footer />
        </>
    );
}

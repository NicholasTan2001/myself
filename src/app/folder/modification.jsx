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
import FormDay from "../components/FormDay";
import ButtonA from "../components/ButtonA";
import { useRouter } from "next/navigation";

export default function ModificationPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isSpecial, setIsSpecial] = useState(false);
    const [hasEntered, setHasEntered] = useState(false);
    const [formData, setFormData] = useState({ name: "", remark: "" });
    const [specialData, setSpecialData] = useState({ name: "", remark: "", date: "", week: "" });
    const [message, setMessage] = useState("");
    const [dailyError, setDailyError] = useState("");
    const [specialError, setSpecialError] = useState("");
    const [dateError, setDateError] = useState("");
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
        setDailyError("");
        setMessage("");
    };

    const handleSpecialChange = (e) => {
        setSpecialData({ ...specialData, [e.target.name]: e.target.value });
        setSpecialError("");
        setDateError("");
        setMessage("");
    };

    const handleSubmitDaily = async (e) => {
        e.preventDefault();
        setDailyError("");
        setMessage("");

        if (!formData.name.trim() || !formData.remark.trim()) {
            setDailyError("*Name and remark are required");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/dailylist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "*Failed to add task");

            setMessage("✅ Daily task added successfully!");
            setFormData({ name: "", remark: "" });
            router.push("/auth/dashboard");
        } catch (err) {
            setMessage(err.message);

        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitSpecial = async (e) => {
        e.preventDefault();
        setSpecialError("");
        setDateError("");
        setMessage("");

        if (!specialData.date && (!specialData.week || specialData.week === "None")) {
            setDateError("*Valid date or day is required");
        }

        if (!specialData.name.trim() || !specialData.remark.trim()) {
            setSpecialError("*Name and remark are required");
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/speciallist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(specialData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "*Failed to add special task");

            setMessage("✅ Special task added successfully!");
            setSpecialData({ name: "", remark: "", date: "", week: "" });
            router.push("/auth/dashboard");
        } catch (err) {
            setMessage(err.message);

        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />
            <Timeout />

            {/* Page Title */}
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

            {/* Flip Animation Container */}
            <div className="flex justify-center items-center mt-10 mb-10 perspective-[1500px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isSpecial ? "special" : "daily"}
                        className="relative bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-5 py-5 text-left w-[80%] lg:w-[1000px]"
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
                                ? { duration: 0.4, ease: "easeInOut" }
                                : { duration: 1, ease: "easeOut" }
                        }
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        {/* Toggle Buttons */}
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

                        {/* Title + Description */}
                        <h1 className="font-semibold px-10">
                            New To-Do List Request – {isSpecial ? "Special" : "Daily"}
                        </h1>
                        <p className="text-gray-500 px-10 mb-5">
                            {isSpecial
                                ? "*Add a new special to-do list with date and week."
                                : "*Add a new daily to-do list."}
                        </p>

                        {/* Special & Daily Task Form */}
                        {isSpecial ? (
                            <form onSubmit={handleSubmitSpecial}>
                                <div className="w-full px-10">
                                    <div className="flex flex-col lg:flex-row">
                                        <div className="w-full lg:flex-3">
                                            <FormInput
                                                label="Task Date"
                                                type="date"
                                                name="date"
                                                value={specialData.date}
                                                onChange={handleSpecialChange}
                                            />
                                        </div>

                                        <div className="w-full lg:flex-1 text-center mb-5 lg:mt-9">
                                            or
                                        </div>

                                        <div className="w-full lg:flex-3">
                                            <FormDay
                                                label="Task Day"
                                                type="select"
                                                name="week"
                                                value={specialData.week}
                                                onChange={handleSpecialChange}
                                            />
                                        </div>
                                    </div>

                                    {dateError && (
                                        <p className="text-red-500 text-left">{dateError}</p>
                                    )}

                                    <div className="flex flex-col lg:flex-row lg:gap-5 mt-5">
                                        <div className="w-full lg:flex-1">
                                            <FormInput
                                                label="Task Name"
                                                type="text"
                                                name="name"
                                                placeholder="Enter your special task name"
                                                value={specialData.name}
                                                onChange={handleSpecialChange}
                                            />
                                        </div>
                                        <div className="w-full lg:flex-1">
                                            <FormInput
                                                label="Remark"
                                                type="text"
                                                name="remark"
                                                placeholder="Enter your task remark"
                                                value={specialData.remark}
                                                onChange={handleSpecialChange}
                                            />
                                        </div>
                                    </div>

                                    {specialError && <p className="text-red-500 text-left mb-5">{specialError}</p>}

                                    <div className="flex justify-end">
                                        {submitting && (
                                            <div className="animate-spin h-5 w-5 border-2 border-blue-400 border-t-transparent rounded-full mr-3 mt-3"></div>
                                        )}
                                        <ButtonA type="submit" disabled={submitting}>
                                            {submitting ? "Adding..." : "Add Task"}
                                        </ButtonA>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleSubmitDaily}>
                                <div className="flex flex-col lg:flex-row lg:gap-5 px-10 mt-5">
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
                                    <div className="w-full lg:flex-1">
                                        <FormInput
                                            label="Remark"
                                            type="text"
                                            name="remark"
                                            placeholder="Enter your task remark"
                                            value={formData.remark}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {dailyError && <p className="text-red-500 text-left px-10 mb-5">{dailyError}</p>}

                                <div className="px-10 flex justify-end">
                                    {submitting && (
                                        <div className="animate-spin h-5 w-5 border-2 border-blue-400 border-t-transparent rounded-full mr-3 mt-3"></div>
                                    )}
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

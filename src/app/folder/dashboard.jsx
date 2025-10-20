"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Timeout from "../components/Timeout";
import Loading from "../components/Loading";
import Footer from "../components/Footer";
import FontA from "../components/FontA";
import Image from "next/image";

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [checkedItems, setCheckedItems] = useState({});
    const [specialChecked, setSpecialChecked] = useState({});
    const [todos, setTodos] = useState([]);
    const [specialTodos, setSpecialTodos] = useState([]);

    const totalChecked = Object.values(checkedItems).filter(Boolean).length;
    const totalSpecialChecked = Object.values(specialChecked).filter(Boolean).length;

    const today = new Date().toLocaleDateString("en-MY", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch("/api/dashboard");
                const data = await res.json();
                if (data.dailyTasks && data.specialTasks) {
                    setTodos(data.dailyTasks.map((t, idx) => ({ ...t, index: idx })));
                    setSpecialTodos(data.specialTasks.map((t, idx) => ({ ...t, index: idx })));
                } else {
                    console.error(data.error);
                }
            } catch (err) {
                console.error("Error fetching tasks:", err);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchTasks, 3000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) return <Loading />;

    const handleCheckboxChange = (index) =>
        setCheckedItems((prev) => ({ ...prev, [index]: !prev[index] }));

    const handleSpecialCheckboxChange = (index) =>
        setSpecialChecked((prev) => ({ ...prev, [index]: !prev[index] }));

    const sortedTodos = [...todos].sort((a, b) => {
        const aChecked = checkedItems[a.index] ? 1 : 0;
        const bChecked = checkedItems[b.index] ? 1 : 0;
        if (aChecked !== bChecked) return aChecked - bChecked;
        return a.index - b.index;
    });

    const sortedSpecialTodos = [...specialTodos]
        .sort((a, b) => {
            const aChecked = specialChecked[a.index] ? 1 : 0;
            const bChecked = specialChecked[b.index] ? 1 : 0;
            if (aChecked !== bChecked) return aChecked - bChecked;

            if (a.date && !b.date) return -1;
            if (!a.date && b.date) return 1;

            return a.index - b.index;
        });

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
                        <h1 className="text-2xl">Dashboard - {today}</h1>
                    </FontA>
                </div>
            </motion.div>

            {/* Two To-Do Lists Side by Side */}
            <div className="flex flex-col lg:flex-row justify-center items-start gap-10 mt-10 mb-10 lg:px-20 px-10">
                {/* Daily To-Do List */}
                <motion.div
                    className="bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 text-left w-full lg:w-1/2"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <h1 className="font-semibold text-lg">Daily To-Do List</h1>
                    <h1 className="font-semibold text-lg text-gray-500 mb-5">
                        * Daily tasks that need to be completed every day.
                    </h1>
                    <ul className="space-y-3">
                        {sortedTodos.length > 0 ? (
                            sortedTodos.map(({ name, remark, index }) => (
                                <motion.li
                                    key={index}
                                    layout
                                    transition={{ type: "spring", stiffness: 150, damping: 20 }}
                                    onClick={() => handleCheckboxChange(index)}
                                    className="group flex flex-col cursor-pointer 
                                    hover:bg-blue-100 active:bg-blue-300 active:text-white 
                                    hover:shadow-[0_0_10px_rgba(191,219,254,1)] select-none rounded-lg px-3 py-2"
                                >
                                    <div className="flex justify-between items-center w-full">
                                        <span
                                            className={`text-black text-md font-semibold group-active:text-white ${checkedItems[index] ? "line-through text-gray-500" : ""}`}
                                        >
                                            {index + 1}. {name}
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={checkedItems[index] || false}
                                            onChange={() => { }}
                                            className="h-5 w-5 appearance-none bg-transparent border-none outline-none cursor-pointer 
                                            checked:bg-transparent checked:before:content-['✔'] checked:before:text-blue-500 
                                            checked:before:flex checked:before:items-center checked:before:justify-center
                                            group-hover:bg-transparent transition"
                                        />
                                    </div>
                                    <p className="text-gray-500 font-semibold text-md mt-1 group-active:text-white">Remark: {remark}</p>
                                </motion.li>
                            ))
                        ) : (

                            <div className="flex flex-col items-center justify-center mt-5">
                                <Image
                                    src="/notask.png"
                                    alt="No tasks"
                                    width={120}
                                    height={120}
                                    className="opacity-80"
                                />
                                <p className="text-gray-400 font-semibold text-center">No tasks available today.</p>
                            </div>
                        )}
                    </ul>

                    <h2 className="font-semibold mt-5 text-right">
                        Completed:{" "}
                        <AnimatePresence mode="popLayout">
                            <motion.span
                                key={totalChecked}
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="inline-block"
                            >
                                {totalChecked}
                            </motion.span>
                        </AnimatePresence>{" "}
                        / {todos.length}
                    </h2>
                </motion.div>

                {/* Special To-Do List */}
                <motion.div
                    className="bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 text-left w-full lg:w-1/2"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <h1 className="font-semibold text-lg">Special To-Do List</h1>
                    <h1 className="font-semibold text-lg text-gray-500 mb-5">
                        * Special tasks that are assigned to certain days.
                    </h1>
                    <ul className="space-y-3">
                        {sortedSpecialTodos.length > 0 ? (
                            sortedSpecialTodos.map(({ name, remark, index, date, week }) => (
                                <motion.li
                                    key={index}
                                    layout
                                    transition={{ type: "spring", stiffness: 150, damping: 20 }}
                                    onClick={() => handleSpecialCheckboxChange(index)}
                                    className="group flex flex-col cursor-pointer 
                                    hover:bg-blue-100 active:bg-blue-300 active:text-white 
                                    hover:shadow-[0_0_10px_rgba(191,219,254,1)] select-none rounded-lg px-3 py-2"
                                >
                                    {date ? (
                                        <div className="text-red-500 font-semibold group-active:text-white">
                                            *{date ? date.split("T")[0] : null}
                                        </div>
                                    ) : (
                                        <div className="text-black font-semibold group-active:text-white">
                                            Every {week ? week : null}
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center w-full">
                                        <span
                                            className={`text-black text-md font-semibold group-active:text-white ${specialChecked[index] ? "line-through text-gray-500" : ""
                                                }`}
                                        >
                                            {index + 1}. {name}
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={specialChecked[index] || false}
                                            onChange={() => { }}
                                            className="h-5 w-5 appearance-none bg-transparent border-none outline-none cursor-pointer 
                                            checked:bg-transparent checked:before:content-['✔'] checked:before:text-red-500 
                                            checked:before:flex checked:before:items-center checked:before:justify-center
                                            group-hover:bg-transparent transition"
                                        />
                                    </div>
                                    <p className="text-gray-500 font-semibold text-md mt-1 group-active:text-white">Remark: {remark}</p>
                                </motion.li>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center mt-5">
                                <Image
                                    src="/notask.png"
                                    alt="No tasks"
                                    width={120}
                                    height={120}
                                    className="opacity-80"
                                />
                                <p className="text-gray-400 font-semibold text-center">No tasks available today.</p>
                            </div>)}
                    </ul>

                    <h2 className="font-semibold mt-5 text-right">
                        Completed:{" "}
                        <AnimatePresence mode="popLayout">
                            <motion.span
                                key={totalSpecialChecked}
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="inline-block"
                            >
                                {totalSpecialChecked}
                            </motion.span>
                        </AnimatePresence>{" "}
                        / {specialTodos.length}
                    </h2>
                </motion.div>
            </div>

            <Footer />
        </>
    );
}

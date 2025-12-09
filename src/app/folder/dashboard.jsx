"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Timeout from "../components/Timeout";
import Loading from "../components/Loading";
import Footer from "../components/Footer";
import FontA from "../components/FontA";
import ChartDailyList from "../components/ChartDailyList";
import ChartSpecialList from "../components/ChartSpecialList";
import Image from "next/image";

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [checkedItems, setCheckedItems] = useState({});
    const [specialChecked, setSpecialChecked] = useState({});
    const [todos, setTodos] = useState([]);
    const [specialTodos, setSpecialTodos] = useState([]);
    const [noteData, setNoteData] = useState([]);
    const [expandedNotes, setExpandedNotes] = useState({});
    const [friendNoteData, setFriendNoteData] = useState([]);
    const [userData, setUserData] = useState([]);

    {/* Function: check item is checked or not */ }
    const totalChecked = Object.values(checkedItems).filter(Boolean).length;
    const totalSpecialChecked = Object.values(specialChecked).filter(Boolean).length;

    {/* Function: create current Malaysia date */ }
    const now = new Date();
    const today = now.toLocaleDateString("en-MY", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    {/* Effect: get fetch to taskrecord api */ }
    useEffect(() => {
        const fetchAndResetTasks = async () => {
            try {
                const res = await fetch("/api/taskrecord");
                const data = await res.json();

                if (data.error) {
                    console.error(data.error);
                }
            } catch (err) {
                console.error("*Error fetching tasks:", err);
            }
        };
        const timer = setTimeout(fetchAndResetTasks, 2850);
        return () => clearTimeout(timer);
    }, []);

    {/* Effect: get data from dashboard api */ }
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch("/api/dashboard");
                const data = await res.json();
                if (data.dailyTasks && data.specialTasks) {
                    const dailyWithIndex = data.dailyTasks.map((t, idx) => ({
                        ...t,
                        index: idx,
                    }));

                    const specialWithIndex = data.specialTasks.map((t, idx) => ({
                        ...t,
                        index: idx,
                    }));

                    setTodos(dailyWithIndex);
                    setSpecialTodos(specialWithIndex);

                    const initialChecked = {};
                    dailyWithIndex.forEach((t) => {
                        initialChecked[t.index] = t.check === "true";
                    });
                    setCheckedItems(initialChecked);

                    const initialSpecialChecked = {};
                    specialWithIndex.forEach((t) => {
                        initialSpecialChecked[t.index] = t.check === "true";
                    });
                    setSpecialChecked(initialSpecialChecked);
                }
                else {
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

    {/* Effect: get fetch to note api */ }
    useEffect(() => {
        const fetchNoteData = async () => {
            try {
                const res = await fetch("/api/note");
                const data = await res.json();

                if (!data.error) {
                    setNoteData(data.noteData);
                }
            } catch (err) {
                console.error("*Error fetching tasks:", err);
            }
        };
        const timer = setTimeout(fetchNoteData, 3000);
        return () => clearTimeout(timer);
    }, []);


    {/* Effect: get fetch to friend note api */ }
    useEffect(() => {
        const fetchFriendNoteData = async () => {
            try {
                const res = await fetch("/api/friendnote");
                const data = await res.json();

                if (!data.error) {
                    setFriendNoteData(data.friendNoteData);
                    setUserData(data.users);
                }
            } catch (err) {
                console.error("*Error fetching tasks:", err);
            }
        };
        const timer = setTimeout(fetchFriendNoteData, 3000);
        return () => clearTimeout(timer);
    }, []);

    {/* Function: loading page */ }
    if (loading) return <Loading />;

    {/* Function: change the location when daily task is checked */ }
    const handleCheckboxChange = async (index, taskId) => {
        setCheckedItems((prev) => {
            const newChecked = !prev[index];

            fetch("/api/dailytaskcheck", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: taskId,
                    check: newChecked ? "true" : "false"
                })
            }).catch((err) => console.error("Error updating check:", err));

            return { ...prev, [index]: newChecked };
        });
    };

    {/* Function: change the location when special task is checked */ }
    const handleSpecialCheckboxChange = async (index, taskId) => {
        setSpecialChecked((prev) => {
            const newSpecialChecked = !prev[index];

            fetch("/api/specialtaskcheck", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: taskId,
                    check: newSpecialChecked ? "true" : "false"
                })
            }).catch((err) => console.error("Error updating check:", err));

            return { ...prev, [index]: newSpecialChecked };
        });
    };

    {/* Function: sort the daily task list */ }
    const sortedTodos = [...todos].sort((a, b) => {
        const aChecked = checkedItems[a.index] ? 1 : 0;
        const bChecked = checkedItems[b.index] ? 1 : 0;
        if (aChecked !== bChecked) return aChecked - bChecked;
        return a.index - b.index;
    });

    {/* Function: sort the special task list */ }
    const sortedSpecialTodos = [...specialTodos]
        .sort((a, b) => {
            const aChecked = specialChecked[a.index] ? 1 : 0;
            const bChecked = specialChecked[b.index] ? 1 : 0;
            if (aChecked !== bChecked) return aChecked - bChecked;

            if (a.date && !b.date) return -1;
            if (!a.date && b.date) return 1;

            return a.index - b.index;
        });

    {/* Function: Make short sentences */ }
    const getShortText = (text) => {
        const words = text.split(" ");
        if (words.length <= 10) return text;

        const firstPart = words.slice(0, 10).join(" ");
        return (
            <>
                {firstPart}
                <span className="text-gray-400 font-semibold"> ... ... ... More </span>
            </>
        );
    };

    {/* Function: get friend name */ }
    function getUserName(id) {
        const user = userData.find(u => u.id === id);
        return user ? user.name : "Unknown";
    }

    return (
        <>
            <header><Navbar /></header>

            <main className="flex flex-col max-w-screen-2xl mx-auto">

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
                            <h1 className="text-xl lg:text-2xl">📅 Dashboard - {today}</h1>
                        </FontA>
                    </div>
                </motion.div>

                {/* Two To-Do Lists Side by Side */}
                <div className="flex flex-col lg:flex-row justify-center items-start gap-10 mt-10 lg:px-20 px-10">
                    {/* Daily To-Do List */}
                    <motion.div
                        className="bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 text-left w-full lg:w-1/2"
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <h1 className="font-semibold text-md lg:text-lg">Daily To-Do List</h1>
                        <h1 className="font-semibold text-md lg:text-lg text-gray-500 mb-5">
                            * Daily tasks that need to be completed every day.
                        </h1>
                        <ul className="space-y-3">
                            {sortedTodos.length > 0 ? (
                                sortedTodos.map(({ name, remark, index }) => (
                                    <motion.li
                                        key={index}
                                        layout
                                        transition={{ type: "spring", stiffness: 150, damping: 20 }}
                                        onClick={() => handleCheckboxChange(index, todos[index].id)}
                                        className="group flex flex-col cursor-pointer 
                                    hover:bg-blue-100 active:bg-blue-300 active:text-white 
                                    hover:shadow-[0_0_10px_rgba(191,219,254,1)] select-none rounded-lg px-3 py-2"
                                    >
                                        <div className="flex justify-between items-center w-full">
                                            <span
                                                className={`text-black text-sm lg:text-base font-semibold group-active:text-white ${checkedItems[index] ? "line-through text-gray-500" : ""}`}
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
                                        <p className="text-gray-500 font-semibold text-sm lg:text-base mt-1 group-active:text-white">Remark: {remark}</p>
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
                                    <p className="text-gray-400 text-sm lg:text-base font-semibold text-center">No tasks available today.</p>
                                </div>
                            )}
                        </ul>

                        <h2 className="font-semibold mt-5 text-sm lg:text-base text-right">
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
                        <h1 className="font-semibold text-md lg:text-lg">Special To-Do List</h1>
                        <h1 className="font-semibold text-md lg:text-lg text-gray-500 mb-5">
                            * Special tasks that are assigned to certain days.
                        </h1>
                        <ul className="space-y-3">
                            {sortedSpecialTodos.length > 0 ? (
                                sortedSpecialTodos.map(({ name, remark, index, date, week }) => (
                                    <motion.li
                                        key={index}
                                        layout
                                        transition={{ type: "spring", stiffness: 150, damping: 20 }}
                                        onClick={() => handleSpecialCheckboxChange(index, specialTodos[index].id)}
                                        className="group flex flex-col cursor-pointer 
                                    hover:bg-blue-100 active:bg-blue-300 active:text-white 
                                    hover:shadow-[0_0_10px_rgba(191,219,254,1)] select-none rounded-lg px-3 py-2"
                                    >
                                        {date && (
                                            <div className="text-red-500 font-semibold group-active:text-white">
                                                *{date ? date.split("T")[0] : null}
                                            </div>
                                        )}

                                        {week && week !== "None" && (
                                            <div className="text-black font-semibold text-sm lg:text-base group-active:text-white">
                                                Every {week}
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center w-full">
                                            <span
                                                className={`text-black text-sm lg:text-base font-semibold group-active:text-white ${specialChecked[index] ? "line-through text-gray-500" : ""
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
                                        <p className="text-gray-500 font-semibold text-sm lg:text-base mt-1 group-active:text-white">Remark: {remark}</p>
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
                                    <p className="text-gray-400 text-sm lg:text-base font-semibold text-center">No tasks available today.</p>
                                </div>)}
                        </ul>

                        <h2 className="font-semibold mt-5 text-sm lg:text-base text-right">
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

                {/* Reminder Note */}
                <motion.div
                    className="flex justify-center items-center mt-20"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.1 }}

                >
                    <div className="bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 text-center w-[70%] lg:w-[50%]">
                        <FontA>
                            <h1 className="text-xl lg:text-2xl">📝 Reminder Note</h1>
                        </FontA>
                    </div>
                </motion.div>

                <div className="flex justify-center mt-10 lg:px-20 gap-3">
                    <motion.div
                        className="mb-10 w-full px-10 lg:w-[80%] max-w-[1600px]"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        <div className="flex flex-col bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 lg:px-10">

                            <h1 className="font-semibold text-md lg:text-lg">Note List</h1>
                            <h1 className="font-semibold text-md lg:text-lg text-gray-500">
                                * Note that need to remind in lifestyle.
                            </h1>

                            <div className="flex flex-col">
                                {noteData.length > 0 ? (
                                    noteData
                                        .sort((a, b) => {
                                            if (a.important == "Important" && b.important != "Important") return -1;
                                            if (a.important != "Important" && b.important == "Important") return 1;
                                            return 0;
                                        })
                                        .map((note) => (
                                            <div
                                                key={note.id}
                                                onClick={() =>
                                                    setExpandedNotes((prev) => ({
                                                        ...prev,
                                                        [note.id]: !prev[note.id],
                                                    }))
                                                }
                                                className="group font-semibold text-sm lg:text-base rounded-lg mt-5 cursor-pointer hover:bg-blue-100 p-3 outline-none hover:shadow-[0_0_10px_rgba(191,219,254,1)] active:bg-blue-300"
                                            >
                                                {note.important == "Important" ? (
                                                    <p className="text-red-300 group-active:text-white">• Important Note</p>
                                                ) : (
                                                    <p className="text-blue-300 group-active:text-white">• Normal Note</p>
                                                )}

                                                <p className="text-black group-active:text-white">
                                                    Note:{" "}
                                                    {expandedNotes[note.id]
                                                        ? note.name
                                                        : getShortText(note.name)}
                                                </p>
                                            </div>

                                        ))
                                ) : (
                                    <>
                                        <div className="flex flex-col justify-center items-center">
                                            <Image
                                                src="/notask.png"
                                                alt="No tasks"
                                                width={120}
                                                height={120}
                                                className="opacity-80"
                                            />
                                            <p className="text-gray-400 text-sm lg:text-base font-semibold text-center">
                                                No note available.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div >
                </div >


                {/* Friends Note */}
                <motion.div
                    className="flex justify-center items-center mt-10"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.1 }}

                >
                    <div className="bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 text-center w-[70%] lg:w-[50%]">
                        <FontA>
                            <h1 className="text-xl lg:text-2xl">👥 Share Note</h1>
                        </FontA>
                    </div>
                </motion.div>


                {/* Friends Note List */}
                < div className="flex justify-center px-10 mt-10 lg:px-20" >
                    <motion.div
                        className="mb-10 w-full lg:w-[80%] max-w-[1600px]"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        <div className="flex flex-col bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 lg:px-10">

                            <h1 className="font-semibold text-md lg:text-lg">Friend's Note</h1>
                            <h1 className="font-semibold text-md lg:text-lg text-gray-500">
                                * Note that share with a friend.
                            </h1>

                            <div className="flex flex-col">
                                {friendNoteData.length > 0 ? (
                                    friendNoteData
                                        .sort((a, b) => {
                                            if (a.type == "Important" && b.type != "Important") return -1;
                                            if (a.type != "Important" && b.type == "Important") return 1;
                                            return 0;
                                        })
                                        .map((friendnote) => (
                                            <div
                                                key={friendnote.id}
                                                onClick={() =>
                                                    setExpandedNotes((prev) => ({
                                                        ...prev,
                                                        [friendnote.id]: !prev[friendnote.id],
                                                    }))
                                                }
                                                className="group font-semibold text-sm lg:text-base rounded-lg mt-5 cursor-pointer hover:bg-blue-100 p-3 outline-none hover:shadow-[0_0_10px_rgba(191,219,254,1)] active:bg-blue-300"
                                            >
                                                <div className="flex flex-col lg:flex-row lg:justify-between">
                                                    {friendnote.type == "Important" ? (
                                                        <p className="text-red-300 group-active:text-white">• Important Note</p>
                                                    ) : (
                                                        <p className="text-blue-300 group-active:text-white">• Normal Note</p>
                                                    )}

                                                    <p className="text-black-300 group-active:text-white">Note by: {getUserName(friendnote.userId)}</p>

                                                </div>

                                                <p className="text-black group-active:text-white">

                                                    Share Note with: {getUserName(friendnote.friendId)}

                                                </p>

                                                <p className="text-black group-active:text-white">
                                                    Note:{" "}
                                                    {expandedNotes[friendnote.id]
                                                        ? friendnote.name
                                                        : getShortText(friendnote.name)}
                                                </p>
                                            </div>

                                        ))
                                ) : (
                                    <>
                                        <div className="flex flex-col justify-center items-center">
                                            <Image
                                                src="/notask.png"
                                                alt="No tasks"
                                                width={120}
                                                height={120}
                                                className="opacity-80"
                                            />
                                            <p className="text-gray-400 text-sm lg:text-base font-semibold text-center">
                                                No note available.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>

                        </div>
                    </motion.div>
                </div >


                {/* Daily Report */}
                < motion.div
                    className="flex justify-center items-center mt-10"
                    initial={{ opacity: 0, y: 50 }
                    }
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.1 }}
                >
                    <div className="bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 text-center w-[70%] lg:w-[50%]">
                        <FontA>
                            <h1 className="text-xl lg:text-2xl">📚 Daily Report</h1>
                        </FontA>
                    </div>
                </motion.div >

                {/* Special and Daily List Chart */}
                < div className="flex justify-center px-10 mt-10 lg:px-20" >
                    <motion.div
                        className="mb-10 w-full max-w-[1600px]"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        <div className="bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 lg:px-10">
                            <div className="flex flex-col lg:flex-row justify-center gap-10 lg:gap-20">
                                {/* Daily To-Do Chart */}
                                <div className="flex-1">
                                    <h2 className="font-semibold text-md lg:text-lg text-left">
                                        Daily To-Do List Chart
                                    </h2>
                                    <p className="font-semibold text-md lg:text-lg text-gray-500 mb-3 text-left">
                                        * A chart displaying the daily tasks that have been completed.
                                    </p>
                                    <ChartDailyList todos={todos} checkedItems={checkedItems} />
                                </div>

                                {/* Special To-Do Chart */}
                                <div className="flex-1">
                                    <h2 className="font-semibold text-md lg:text-lg text-left">
                                        Special To-Do List Chart
                                    </h2>
                                    <p className="font-semibold text-md lg:text-lg text-gray-500 mb-3 text-left">
                                        * A chart displaying the special tasks that have been completed.
                                    </p>
                                    <ChartSpecialList todos={specialTodos} checkedItems={specialChecked} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div >
            </main >

            <footer><Footer /></footer>

        </>
    );
}

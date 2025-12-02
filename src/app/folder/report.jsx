"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Timeout from "../components/Timeout";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import FontA from "../components/FontA";
import ButtonA from "../components/ButtonA";
import FormInput from "../components/FormInput";
import FormList from "../components/FormList";
import ChartDailyFre from "../components/ChartDailyFre";
import ChartSpecialFre from "../components/ChartSpecialFre";
import { motion, AnimatePresence } from "framer-motion";

export default function ReportPage() {
    const [loading, setLoading] = useState(true);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [records, setRecords] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [filterError, setFilterError] = useState("");
    const [typeError, setTypeError] = useState("");
    const [listType, setListType] = useState("None");
    const [tempFromDate, setTempFromDate] = useState("");
    const [tempToDate, setTempToDate] = useState("");
    const [tempListType, setTempListType] = useState("None");
    const [freqFrom, setFreqFrom] = useState("");
    const [freqTo, setFreqTo] = useState("");
    const [tempFreqFrom, setTempFreqFrom] = useState("");
    const [tempFreqTo, setTempFreqTo] = useState("");
    const [dailyFreError, setDailyFreError] = useState("");
    const [freqFrom2, setFreqFrom2] = useState("");
    const [freqTo2, setFreqTo2] = useState("");
    const [tempFreqFrom2, setTempFreqFrom2] = useState("");
    const [tempFreqTo2, setTempFreqTo2] = useState("");
    const [specialFreError, setSpecialFreError] = useState("");

    {/* Function: create current Malaysia date */ }
    const now = new Date();
    const malaysiaOffset = 8 * 60;
    const malaysiaDate = new Date(now.getTime() + malaysiaOffset * 60 * 1000);

    {/* Effect: sort the first 10 days of to-do list frequency*/ }
    useEffect(() => {
        const today = malaysiaDate;
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const tenDaysAgo = new Date(today);
        tenDaysAgo.setDate(today.getDate() - 10);

        const from = tenDaysAgo.toISOString().split("T")[0];
        const to = yesterday.toISOString().split("T")[0];
        const from2 = tenDaysAgo.toISOString().split("T")[0];
        const to2 = yesterday.toISOString().split("T")[0];

        setFreqFrom(from);
        setFreqTo(to);
        setTempFreqFrom(from);
        setTempFreqTo(to);
        setFreqFrom2(from2);
        setFreqTo2(to2);
        setTempFreqFrom2(from2);
        setTempFreqTo2(to2);
    }, []);

    {/* Effact: make sure first effect is show before 3 seconds */ }
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) return <Loading />;

    {/* Function: sort the to-do list history by date */ }
    const handleFilter = async () => {
        let hasError = false;
        setFilterError("");
        setTypeError("");

        if (!tempFromDate && !tempToDate) {
            setFilterError("* Both dates are required.");
            hasError = true;
        } else if (!tempFromDate || !tempToDate) {
            setFilterError("* Please select both 'From' and 'To' dates.");
            hasError = true;
        }

        if (tempListType === "None") {
            setTypeError("* Please select Daily List or Special List.");
            hasError = true;
        }

        if (hasError) {
            setShowTable(false);
            return;
        }

        try {
            setShowTable(false);
            await new Promise((resolve) => setTimeout(resolve, 300));

            const res = await fetch(
                `/api/filter?from=${tempFromDate}T00:00:00.000Z&to=${tempToDate}T23:59:59.999Z&type=${tempListType}`
            );
            const data = await res.json();

            if (res.ok) {
                setFromDate(tempFromDate);
                setToDate(tempToDate);
                setListType(tempListType);
                setRecords(data.records || []);
                setShowTable(true);
            } else {
                setFilterError("* Failed to fetch records.");
                setShowTable(false);
            }
        } catch (err) {
            console.error("Error fetching report:", err);
            setFilterError("* An error occurred while fetching records.");
            setShowTable(false);
        }
    };

    const dailyRecords = records.filter((r) => r.type === "dailylist");
    const specialRecords = records.filter((r) => r.type === "speciallist");

    {/* Function: sort the daily to-do list frequency by date */ }
    const handleDailyFre = () => {
        setDailyFreError("");

        if (!tempFreqFrom || !tempFreqTo) {
            setDailyFreError("* Please select both 'From' and 'To' dates.");
            return;
        }

        const from = new Date(tempFreqFrom);
        const to = new Date(tempFreqTo);

        const diffDays = (to - from) / (1000 * 60 * 60 * 24);

        if (diffDays > 10) {
            setDailyFreError("* Please select date range within 10 days.");
            return;
        }

        if (diffDays < 0) {
            setDailyFreError("* Please select valid date range.");
            return;
        }

        setFreqFrom(tempFreqFrom);
        setFreqTo(tempFreqTo);
    };

    {/* Function: sort the special to-do list frequency by date */ }
    const handleSpecialFre = () => {
        setSpecialFreError("");

        if (!tempFreqFrom2 || !tempFreqTo2) {
            setSpecialFreError("* Please select both 'From' and 'To' dates.");
            return;
        }

        const from = new Date(tempFreqFrom2);
        const to = new Date(tempFreqTo2);

        const diffDays = (to - from) / (1000 * 60 * 60 * 24);

        if (diffDays > 10) {
            setSpecialFreError("* Please select date range within 10 days.");
            return;
        }

        if (diffDays < 0) {
            setSpecialFreError("* Please select valid date range.");
            return;
        }

        setFreqFrom2(tempFreqFrom2);
        setFreqTo2(tempFreqTo2);
    };


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
                            <h1 className="text-xl lg:text-2xl">📊 Report</h1>
                        </FontA>
                    </div>
                </motion.div>

                <div className="flex flex-col justify-center items-center gap-10 mt-10 mb-10 lg:px-20 px-10">
                    {/* Filter Form */}
                    <motion.div
                        className="bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 text-left w-full lg:w-[70%]"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <h1 className="font-semibold text-md lg:text-lg">To-Do List History</h1>
                        <h1 className="font-semibold text-md lg:text-lg text-gray-500 mb-5">
                            * Filter daily or special list records by date range.
                        </h1>

                        <div className="flex flex-col lg:flex-row lg:gap-10 text-sm lg:text-base">
                            <FormInput
                                label="From"
                                type="date"
                                name="from"
                                value={tempFromDate}
                                onChange={(e) => {
                                    setTempFromDate(e.target.value);
                                    setFilterError("");
                                }}
                            />
                            <FormInput
                                label="To"
                                type="date"
                                name="to"
                                value={tempToDate}
                                onChange={(e) => {
                                    setTempToDate(e.target.value);
                                    setFilterError("");
                                }}
                            />
                        </div>

                        {filterError && <p className="text-red-500 text-left mb-5">{filterError}</p>}

                        <div className="text-sm lg:text-base">
                            <FormList
                                label="Type List"
                                type="select"
                                name="type"
                                onChange={(e) => {
                                    setTempListType(e.target.value);
                                    setTypeError("");
                                }}
                                value={tempListType}
                            />
                        </div>

                        {typeError && <p className="text-red-500 text-left mb-5">{typeError}</p>}

                        <div className="flex justify-end">
                            <ButtonA onClick={handleFilter}>Filter</ButtonA>
                        </div>
                    </motion.div>

                    {/* History Table */}
                    <AnimatePresence mode="wait">
                        {showTable && listType === "Daily List" && (
                            <motion.div
                                className="bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 text-left w-full lg:w-[80%]"
                                initial={{ opacity: 0, y: -70 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -70 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                            >
                                <h1 className="font-semibold text-md lg:text-lg">History Table - Daily To-Do List</h1>
                                <h1 className="font-semibold text-md lg:text-lg text-gray-500 mb-5">
                                    * Daily to-do list records between {fromDate} and {toDate}.
                                </h1>

                                <table className="table-fixed w-full border-collapse shadow-sm rounded-md overflow-hidden mb-3">
                                    <thead>
                                        <tr className="bg-blue-300 text-white text-left text-sm lg:text-base">
                                            <th className="px-4 py-2 break-words">Date</th>
                                            <th className="px-4 py-2 break-words">Name</th>
                                            <th className="px-4 py-2 break-words">Remark</th>
                                            <th className="px-4 py-2 break-words">Checklist</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dailyRecords.length > 0 ? (
                                            dailyRecords.map((record, index) => (
                                                <tr
                                                    key={record.id}
                                                    className={
                                                        index % 2 === 0
                                                            ? "bg-white text-black"
                                                            : "bg-gray-200 text-black"
                                                    }
                                                >
                                                    <td className="px-4 py-2 text-sm lg:text-base break-words">
                                                        {new Date(record.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm lg:text-base break-words">{record.name}</td>
                                                    <td className="px-4 py-2 text-sm lg:text-base break-words">{record.remark}</td>
                                                    <td className="px-4 py-2 text-sm lg:text-base break-words">
                                                        {record.check === "true" ? "DONE" : "NOT DONE"}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center text-gray-400 py-3 text-sm lg:text-base">
                                                    No records found ...
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </motion.div>
                        )}

                        {showTable && listType === "Special List" && (
                            <motion.div
                                className="bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 text-left w-full lg:w-[80%]"
                                initial={{ opacity: 0, y: -70 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -70 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                            >
                                <h1 className="font-semibold text-md lg:text-lg">History Table - Special To-Do List</h1>
                                <h1 className="font-semibold text-md lg:text-lg text-gray-500 mb-5">
                                    * Special to-do list records between {fromDate} and {toDate}.
                                </h1>

                                <table className="table-fixed w-full border-collapse shadow-sm rounded-md overflow-hidden mb-3">
                                    <thead>
                                        <tr className="bg-blue-300 text-white text-left text-sm lg:text-base">
                                            <th className="px-4 py-2 break-words">Date</th>
                                            <th className="px-4 py-2 break-words">Name</th>
                                            <th className="px-4 py-2 break-words">Remark</th>
                                            <th className="px-4 py-2 break-words">Checklist</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {specialRecords.length > 0 ? (
                                            specialRecords.map((record, index) => (
                                                <tr
                                                    key={record.id}
                                                    className={
                                                        index % 2 === 0
                                                            ? "bg-white text-black"
                                                            : "bg-gray-200 text-black"
                                                    }
                                                >
                                                    <td className="px-4 py-2 text-sm lg:text-base break-words">
                                                        {new Date(record.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm lg:text-base break-words">{record.name}</td>
                                                    <td className="px-4 py-2 text-sm lg:text-base break-words">{record.remark}</td>
                                                    <td className="px-4 py-2 text-sm lg:text-base break-words">
                                                        {record.check === "true" ? "TRUE" : "FALSE"}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center text-gray-400 py-3 text-sm lg:text-base">
                                                    No records found ...
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex flex-col lg:flex-row px-10 lg:px-20 lg:px-30 gap-10 mb-10">
                    {/* Filter Form - Daily To-Do List Frequency*/}
                    <motion.div
                        className="flex-1 bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 text-left w-full lg:w-[70%] h-full"
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <h1 className="font-semibold text-md lg:text-lg">Daily To-Do List Frequency</h1>
                        <h1 className="font-semibold text-md lg:text-lg text-gray-500 mb-5">
                            * Filter daily list by date range to show its frequency.
                        </h1>

                        <div className="flex flex-col text-sm lg:text-base">
                            <FormInput
                                label="From"
                                type="date"
                                name="from"
                                value={tempFreqFrom}
                                onChange={(e) => {
                                    setTempFreqFrom(e.target.value)
                                    setDailyFreError("");

                                }}
                            />
                            <FormInput
                                label="To"
                                type="date"
                                name="to"
                                value={tempFreqTo}
                                onChange={(e) => {
                                    setTempFreqTo(e.target.value)
                                    setDailyFreError("");
                                }}

                            />
                        </div>

                        {dailyFreError && <p className="text-red-500 text-left mb-5">{dailyFreError}</p>}

                        <div className="flex justify-end">
                            <ButtonA
                                onClick={handleDailyFre}
                            >
                                Filter
                            </ButtonA>
                        </div>
                    </motion.div>

                    {/* Daily To-Do List Frequency Chart */}
                    <motion.div
                        className="flex-2 bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 text-left w-full lg:w-[70%] h-full"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <h1 className="font-semibold text-md lg:text-lg">Daily To-Do List Frequency Chart</h1>
                        <h1 className="font-semibold text-md lg:text-lg text-gray-500 mb-5">
                            * Filter daily list by date range to show its frequency.
                        </h1>

                        <ChartDailyFre fromDate={freqFrom} toDate={freqTo} />

                        <h1 className="flex font-semibold text-sm lg:text-base justify-center mt-1">
                            Completion Daily List between {freqFrom} and {freqTo}.
                        </h1>
                    </motion.div>
                </div>

                <div className="flex flex-col lg:flex-row px-10 lg:px-20 lg:px-30 gap-10 mb-10">
                    {/* Filter Form - Special To-Do List Frequency */}
                    <motion.div
                        className="flex-1 bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 text-left w-full lg:w-[70%] h-full"
                        initial={{ opacity: 0, x: -100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <h1 className="font-semibold text-lg">Special To-Do List Frequency</h1>
                        <h1 className="font-semibold text-lg text-gray-500 mb-5">
                            * Filter special list by date range to show its frequency.
                        </h1>

                        <div className="flex flex-col">
                            <FormInput
                                label="From"
                                type="date"
                                name="from"
                                value={tempFreqFrom2}
                                onChange={(e) => {
                                    setTempFreqFrom2(e.target.value)
                                    setSpecialFreError("");

                                }}
                            />
                            <FormInput
                                label="To"
                                type="date"
                                name="to"
                                value={tempFreqTo2}
                                onChange={(e) => {
                                    setTempFreqTo2(e.target.value)
                                    setSpecialFreError("");
                                }}

                            />
                        </div>

                        {specialFreError && <p className="text-red-500 text-left mb-5">{specialFreError}</p>}

                        <div className="flex justify-end">
                            <ButtonA
                                onClick={handleSpecialFre}
                            >
                                Filter
                            </ButtonA>
                        </div>
                    </motion.div>

                    {/* Special To-Do List Frequency Chart */}
                    <motion.div
                        className="flex-2 bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 text-left w-full lg:w-[70%] h-full"
                        initial={{ opacity: 0, x: 100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <h1 className="font-semibold text-md lg:text-lg">Special To-Do List Frequency Chart</h1>
                        <h1 className="font-semibold text-md lg:text-lg text-gray-500 mb-5">
                            * Filter special list by date range to show its frequency.
                        </h1>

                        <ChartSpecialFre fromDate={freqFrom2} toDate={freqTo2} />

                        <h1 className="flex font-semibold text-sm lg:text-base justify-center mt-1">
                            Completion Daily List between {freqFrom2} and {freqTo2}.
                        </h1>
                    </motion.div>
                </div>

            </main>

            <footer><Footer /></footer>
        </>
    );
}

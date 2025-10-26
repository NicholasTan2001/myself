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
import ButtonB from "../components/ButtonB";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
    const [todos, setTodos] = useState([]);
    const [specialTodos, setSpecialTodos] = useState([]);
    const [isSpecial2, setIsSpecial2] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [dailyError2, setDailyError2] = useState({ name: "", remark: "" });
    const [updating, setUpdating] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [selectedTask2, setSelectedTask2] = useState(null);
    const [specialError2, setSpecialError2] = useState({ name: "", remark: "" });

    {/* Effect: make sure first effect is show before 4.5 seconds */ }
    useEffect(() => {
        const timer = setTimeout(() => setHasEntered(true), 4500);
        return () => clearTimeout(timer);
    }, []);

    {/* Effect: get data from dailylist api */ }
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch("/api/dailylist");
                const data = await res.json();
                if (data.dailyTasks) {
                    setTodos(data.dailyTasks.map((t, idx) => ({ ...t, index: idx })));
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

    {/* Effect: get data from speciallist api */ }
    useEffect(() => {
        const fetchSpecialTasks = async () => {
            try {
                const res = await fetch("/api/speciallist");
                const data = await res.json();
                if (data.specialTasks) {
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

        const timer = setTimeout(fetchSpecialTasks, 3000);
        return () => clearTimeout(timer);
    }, []);

    {/* Function: loading page */ }
    if (loading) return <Loading />;

    {/* Function: set data in FormData */ }
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setDailyError("");
        setMessage("");
    };

    {/* Function: set data in specialData */ }
    const handleSpecialChange = (e) => {
        setSpecialData({ ...specialData, [e.target.name]: e.target.value });
        setSpecialError("");
        setDateError("");
        setMessage("");
    };

    {/* Function: submit daily task list*/ }
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

            setFormData({ name: "", remark: "" });
            router.push("/auth/dashboard");
        } catch (err) {
            setMessage(err.message);

        } finally {
            setSubmitting(false);
        }
    };

    {/* Function: submit special task list */ }
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

            setSpecialData({ name: "", remark: "", date: "", week: "" });
            router.push("/auth/dashboard");
        } catch (err) {
            setMessage(err.message);

        } finally {
            setSubmitting(false);
        }
    };

    {/* Function: update daily task list */ }
    const handleUpdateTask = async (e) => {
        e.preventDefault();
        const newErrors = { name: "", remark: "" };
        if (!selectedTask.name.trim()) newErrors.name = "*Task name is required";
        if (!selectedTask.remark.trim()) newErrors.remark = "*Remark is required";
        setDailyError2(newErrors);

        try {
            const res = await fetch("/api/dailytaskupdate", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedTask.id,
                    name: selectedTask.name,
                    remark: selectedTask.remark,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update task");

            setUpdating(true);

            window.location.reload();
        } catch (err) {

        }
    };

    {/* Function: delete daily task list */ }
    const handleDeleteTask = async (e) => {
        e.preventDefault();

        setRemoving(true);
        try {
            const res = await fetch("/api/dailytaskupdate", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: selectedTask.id }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete task");

            window.location.reload();
        } catch (err) {

        }
    };

    {/* Function: update special task list */ }
    const handleUpdateSpecialTask = async (e) => {
        e.preventDefault();
        const newErrors = { name: "", remark: "", date: "", week: "" };
        if (!selectedTask2.date && selectedTask2.week === "None") newErrors.date = "*Task date or week is required";

        if (!selectedTask2.name.trim()) newErrors.name = "*Task name is required";
        if (!selectedTask2.remark.trim()) newErrors.remark = "*Remark is required";
        setSpecialError2(newErrors);

        if (newErrors.name || newErrors.remark || newErrors.date) return;

        setUpdating(true);
        try {

            const res = await fetch("/api/specialtaskupdate", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedTask2),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update special task");
            window.location.reload();
        } catch (err) {

        }
    };

    {/* Function: delete special task list */ }
    const handleDeleteSpecialTask = async (e) => {
        e.preventDefault();

        setRemoving(true);
        try {
            const res = await fetch("/api/specialtaskupdate", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: selectedTask2.id }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete task");

            window.location.reload();
        } catch (err) {

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
                <div className="bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 text-center w-[70%] lg:w-[50%]">
                    <FontA>
                        <h1 className="text-2xl">Modification</h1>
                    </FontA>
                </div>
            </motion.div>

            {/* Flip Animation Container */}
            <div className="flex justify-center items-center mt-10 mb-10 px-10 ">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isSpecial ? "special" : "daily"}
                        className="relative bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-5 py-5 text-left w-full lg:w-[70%]"
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
                        <h1 className="font-semibold text-lg px-10">
                            New To-Do List Request – {isSpecial ? "Special" : "Daily"}
                        </h1>
                        <p className="text-gray-500 text-lg font-semibold px-10 mb-5">
                            {isSpecial
                                ? "*Add a new special to-do list with date and week."
                                : "*Add a new daily to-do list."}
                        </p>

                        {/*New Special & Daily Task Request Form */}
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

            {/* Modification */}
            <div className="flex flex-col lg:flex-row lg:gap-20 lg:items-start gap-10 justify-center items-center mt-10 mb-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isSpecial2 ? "special-list" : "daily-list"}
                        className="relative bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-15 py-5 text-left w-[70%] lg:w-[50%]"
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
                        {/* Flip Animation Container 2.0 */}
                        {!isSpecial2 ? (
                            <button
                                onClick={() => setIsSpecial2(true)}
                                className="absolute right-5 top-5 text-gray-300 hover:text-blue-300 transition"
                                title="Switch to Special Tasks"
                            >
                                <ChevronRight size={28} />
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsSpecial2(false)}
                                className="absolute left-5 top-5 text-gray-300 hover:text-blue-300 transition"
                                title="Back to Daily Tasks"
                            >
                                <ChevronLeft size={28} />
                            </button>
                        )}

                        {/* Modification Special & Daily Task Selection*/}
                        {!isSpecial2 ? (
                            <>
                                <h1 className="font-semibold text-lg">Modification Daily To-Do List</h1>
                                <h1 className="font-semibold text-lg text-gray-500 mb-5">
                                    *Modify your current daily task
                                </h1>

                                <div className="mt-5">
                                    {todos.length > 0 ? (
                                        <ul className="list-disc">
                                            {todos.map(({ id, name, remark, index }) => (
                                                <li
                                                    key={index}
                                                    onClick={() => {
                                                        setSelectedTask({ id, name, remark })
                                                        setSelectedTask2(null);
                                                    }}
                                                    className={`group flex flex-col cursor-pointer mb-3 text-md rounded-lg px-3 py-2 select-none 
                                                            transition-all duration-300 ease-in-out
                                                            ${selectedTask?.id === id
                                                            ? "bg-blue-300 text-white shadow-[0_0_10px_rgba(191,219,254,1)]"
                                                            : "hover:bg-blue-100 hover:shadow-[0_0_10px_rgba(191,219,254,1)]"
                                                        }`}
                                                >
                                                    <span className="font-semibold">
                                                        {index + 1}. {name}
                                                    </span>

                                                    <p
                                                        className={`font-semibold text-md mt-1 transition-all duration-300 ease-in-out ${selectedTask?.id === id ? "text-white" : "text-gray-500"
                                                            }`}
                                                    >
                                                        Remark: {remark}
                                                    </p>
                                                </li>

                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center mt-5">
                                            <Image
                                                src="/notask.png"
                                                alt="No tasks"
                                                width={120}
                                                height={120}
                                                className="opacity-80"
                                            />
                                            <p className="text-gray-400 text-center">No tasks available today.</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 className="font-semibold text-lg">Modification Special To-Do List</h1>
                                <h1 className="font-semibold text-lg text-gray-500 mb-5">
                                    *Modify your current special task
                                </h1>

                                <div className="mt-5">
                                    {specialTodos.length > 0 ? (
                                        <ul className="list-disc">
                                            {specialTodos.map(({ id, name, remark, index, date, week }) => (
                                                <li
                                                    key={index}
                                                    onClick={() => {
                                                        setSelectedTask2({ id, name, remark, date, week })
                                                        setSelectedTask(null);
                                                    }}
                                                    className={`group flex flex-col cursor-pointer mb-3 text-md rounded-lg px-3 py-2 select-none 
                                                            transition-all duration-300 ease-in-out
                                                            ${selectedTask2?.id === id
                                                            ? "bg-blue-300 text-white shadow-[0_0_10px_rgba(191,219,254,1)]"
                                                            : "hover:bg-blue-100 hover:shadow-[0_0_10px_rgba(191,219,254,1)]"
                                                        }`}
                                                >

                                                    {date && (
                                                        <div className={`text-red-500 font-semibold transition-all duration-300 ease-in-out
                                                        ${selectedTask2?.id === id
                                                                ? "text-white"
                                                                : "text-red-500"
                                                            }`}
                                                        >
                                                            * {date ? date.split("T")[0] : null}
                                                        </div>
                                                    )}

                                                    {week && week !== "None" && (
                                                        <div className={`ext-black font-semibold transition-all duration-300 ease-in-out
                                                         ${selectedTask2?.id === id
                                                                ? "text-white"
                                                                : "text-black"
                                                            }`}
                                                        >
                                                            Every {week}
                                                        </div>
                                                    )}

                                                    <span className="font-semibold">
                                                        {index + 1}. {name}
                                                    </span>
                                                    <div className={`font-semibold text-md mt-1 transition-all duration-300 ease-in-out ${selectedTask2?.id === id ? "text-white" : "text-gray-500"
                                                        }`}>
                                                        Remark: {remark}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center mt-5">
                                            <Image
                                                src="/notask.png"
                                                alt="No tasks"
                                                width={120}
                                                height={120}
                                                className="opacity-80"
                                            />
                                            <p className="text-gray-400 text-center">No tasks available today.</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Modification Special & Daily Task Update & Delete Form */}
                <AnimatePresence mode="wait">
                    {(selectedTask || selectedTask2) && (
                        <motion.div
                            key={selectedTask2 ? "special-selected" : "daily-selected"}
                            className="relative bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 text-left w-[70%] lg:w-[30%]"
                            initial={{
                                opacity: 0,
                                x: -100,
                            }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{
                                opacity: 0,
                                x: -100,
                            }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        >
                            {selectedTask && (
                                <>
                                    <h1 className="font-semibold text-lg">Modification Daily Task Selected</h1>
                                    <h1 className="font-semibold text-lg text-gray-500 mb-5">
                                        *Modify your selected daily task
                                    </h1>
                                    <form>
                                        <FormInput
                                            label="Task Name"
                                            type="text"
                                            name="name"
                                            value={selectedTask?.name || ""}
                                            onChange={(e) => {
                                                setSelectedTask({ ...selectedTask, name: e.target.value })
                                                setDailyError2((prev) => ({ ...prev, name: "" }));
                                            }}
                                        />
                                        {dailyError2.name && <p className="text-red-500 text-left mb-5">{dailyError2.name}</p>}

                                        <FormInput
                                            label="Remark"
                                            type="text"
                                            name="remark"
                                            value={selectedTask?.remark || ""}
                                            onChange={(e) => {
                                                setSelectedTask({ ...selectedTask, remark: e.target.value })
                                                setDailyError2((prev) => ({ ...prev, remark: "" }));
                                            }}
                                        />
                                        {dailyError2.remark && <p className="text-red-500 text-left mb-5">{dailyError2.remark}</p>}

                                        <div className="mt-5 flex justify-end items-center gap-5">
                                            {updating && (
                                                <div className="animate-spin rounded-full h-5 w-5 border-3 border-blue-300 border-solid border-t-transparent"></div>
                                            )}
                                            <div className="flex justify-end">
                                                <ButtonA onClick={handleUpdateTask}>{updating ? "Updating..." : "Update Task"}</ButtonA>
                                            </div>
                                        </div>
                                        <div className="flex mt-5">
                                            <ButtonB onClick={handleDeleteTask} className="w-full">
                                                {removing ? "Removing..." : "Remove Task"}
                                            </ButtonB>
                                        </div>
                                    </form>
                                </>
                            )}

                            {selectedTask2 && (
                                <>
                                    <h1 className="font-semibold text-lg">Modification Special Task Selected</h1>
                                    <h1 className="font-semibold text-lg text-gray-500 mb-5">
                                        *Modify your selected special task
                                    </h1>
                                    <form>
                                        <FormInput
                                            label="Task Date"
                                            type="date"
                                            name="date"
                                            value={selectedTask2?.date ? selectedTask2.date.split("T")[0] : ""}
                                            onChange={(e) => {
                                                setSelectedTask2({ ...selectedTask2, date: e.target.value })

                                            }}
                                        />

                                        <div className="flex justify-center">or</div>

                                        <FormDay
                                            label="Task Day"
                                            type="select"
                                            name="week"
                                            value={selectedTask2?.week || ""}
                                            onChange={(e) => {
                                                setSelectedTask2({ ...selectedTask2, week: e.target.value })
                                            }}
                                        />
                                        {specialError2.date && <p className="text-red-500 text-left mb-5">{specialError2.date}</p>}

                                        <div className="mt-15">

                                            <FormInput
                                                label="Task Name"
                                                type="text"
                                                name="name"
                                                value={selectedTask2?.name || ""}
                                                onChange={(e) => {
                                                    setSelectedTask2({ ...selectedTask2, name: e.target.value })
                                                    setSpecialError2((prev) => ({ ...prev, name: "" }));

                                                }}

                                            />

                                            {specialError2.name && <p className="text-red-500 text-left mb-5">{specialError2.name}</p>}

                                            <FormInput
                                                label="Remark"
                                                type="text"
                                                name="remark"
                                                value={selectedTask2?.remark || ""}
                                                onChange={(e) => {
                                                    setSelectedTask2({ ...selectedTask2, remark: e.target.value })
                                                    setSpecialError2((prev) => ({ ...prev, remark: "" }));

                                                }}
                                            />

                                            {specialError2.remark && <p className="text-red-500 text-left mb-5">{specialError2.remark}</p>}

                                        </div>

                                        <div className="mt-5 flex justify-end items-center gap-5">
                                            {updating && (
                                                <div className="animate-spin rounded-full h-5 w-5 border-3 border-blue-300 border-solid border-t-transparent"></div>
                                            )}
                                            <ButtonA onClick={handleUpdateSpecialTask}>{updating ? "Updating..." : "Update Task"}</ButtonA>
                                        </div>

                                        <div className="flex mt-5">
                                            <ButtonB onClick={handleDeleteSpecialTask} className="w-full">
                                                {removing ? "Removing..." : "Remove Task"}
                                            </ButtonB>
                                        </div>
                                    </form>
                                </>

                            )}
                        </motion.div>
                    )}

                </AnimatePresence>

            </div >
            <Footer />
        </>
    );
}

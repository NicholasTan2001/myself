"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Timeout from "../components/Timeout";
import Loading from "../components/Loading";
import Footer from "../components/Footer";
import FontA from "../components/FontA";
import ButtonA from "../components/ButtonA";
import ButtonB from "../components/ButtonB";
import FormInput from "../components/FormInput";
import { useRouter } from "next/navigation";

export default function MyProfilePage() {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({ name: "", email: "", password: "", confirmPassword: "", deletePassword: "" });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/myprofile");
                const data = await res.json();
                if (data.user) setUserData({ ...userData, name: data.user.name, email: data.user.email });
                else setMessage(data.error);
            } catch {
                setMessage("Error fetching user data");
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
        setErrors({ ...errors, [name]: "" });
        setMessage("");
    };

    const handleDeleteChange = (e) => {
        setDeletePassword(e.target.value);
        setDeleteError("");
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage("");
        setSubmitting(true);

        let newErrors = {};
        if (!userData.name.trim()) newErrors.name = "*Name cannot be empty";
        if (!userData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) newErrors.email = "*Invalid email";
        if (userData.password && userData.password.length < 6) newErrors.password = "*Password must be at least 6 characters";
        if (userData.password !== userData.confirmPassword) newErrors.confirmPassword = "*Passwords do not match";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setSubmitting(false);
            return;
        }

        try {
            const res = await fetch("/api/myprofile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update");
            setMessage("Profile updated successfully!");
            setTimeout(() => router.push("/auth/dashboard"), 1000);
        } catch (err) {
            setMessage(err.message);
            setSubmitting(false);
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        if (!userData.deletePassword) {
            setErrors({ deletePassword: "*Password required" });
            return;
        }

        setDeleting(true);
        try {
            const res = await fetch("/api/delete-acc", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: userData.deletePassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "*Failed to delete account");

            router.push("/login");
        } catch (err) {
            setMessage(err.message);
            setDeleting(false);
        }
    };

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        if (!deletePassword.trim()) {
            setDeleteError("*Password is required");
            return;
        }

        setDeleteLoading(true);
        try {
            const res = await fetch("/api/delete-acc", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: deletePassword }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "*Failed to delete account");

            router.push("/");
        } catch (err) {
            setDeleteError(err.message);
            setDeleteLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <>
            <Navbar />
            <Timeout />

            {/* Title */}
            <motion.div
                className="flex justify-center items-center mt-10"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.3 }}
            >
                <div className="bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 text-center w-[70%] lg:w-[800px]">
                    <FontA>
                        <h1 className="text-2xl">My Profile</h1>
                    </FontA>
                </div>
            </motion.div>

            {/* Form */}
            <motion.div
                className="flex justify-center items-center mt-10 mb-10"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.3 }}
            >
                <div className="bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 text-left w-[80%] lg:w-[1000px]">
                    <h1 className="font-semibold mb-5">My Personal Information</h1>

                    <form className="space-y-4" onSubmit={handleUpdate}>
                        <div>
                            <FormInput
                                label="Name"
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                onChange={handleChange}
                                value={userData.name}
                            />
                            {errors.name && <p className="text-sm text-red-600 text-left mb-5">{errors.name}</p>}
                        </div>

                        <div>
                            <FormInput
                                label="Email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                onChange={handleChange}
                                value={userData.email}
                            />
                            {errors.email && <p className="text-sm text-red-600 text-left mb-5">{errors.email}</p>}
                        </div>

                        <div>
                            <FormInput
                                label="Password"
                                type="password"
                                name="password"
                                placeholder="Enter new password"
                                onChange={handleChange}
                                value={userData.password}
                            />
                            {errors.password && <p className="text-sm text-red-600 text-left mb-5">{errors.password}</p>}
                        </div>

                        <div>
                            <FormInput
                                label="Confirm Password"
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                onChange={handleChange}
                                value={userData.confirmPassword}
                            />
                            {errors.confirmPassword && <p className="text-sm text-red-600 text-left">{errors.confirmPassword}</p>}
                        </div>

                        <div className="mt-5 flex justify-end items-center gap-5">
                            {submitting && (
                                <div className="animate-spin rounded-full h-5 w-5 border-3 border-blue-300 border-solid border-t-transparent"></div>
                            )}
                            <ButtonA type="submit" disabled={submitting}>
                                {submitting ? "Updating..." : "Update Now"}
                            </ButtonA>
                        </div>
                    </form>
                </div>
            </motion.div>

            {/* Account Deletion */}
            <motion.div
                className="flex justify-center items-center mt-10 mb-10"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.3 }}
            >
                <div className="bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.8)] rounded-2xl px-10 py-5 text-left w-[80%] lg:w-[1000px]">
                    <h1 className="font-semibold mb-5 text-red-500">Account Deletion</h1>
                    <div className="font-semibold mb-5">*You are about to permanently delete your account.
                        Once your account is deleted, all your data, settings, and personal information
                        will be irreversibly removed from our system. If you are certain that you want to
                        proceed, please enter your password below to confirm your decision. Only after verifying
                        your password will the deletion process begin. Take a moment to ensure that you really
                        want to delete your account, as this action is final and irreversible.
                    </div>

                    <form onSubmit={handleDeleteAccount}>
                        <div>
                            <FormInput
                                label="Password"
                                type="password"
                                name="deletePassword"
                                placeholder="Enter your password"
                                value={deletePassword}
                                onChange={handleDeleteChange}
                            />
                            {deleteError && <p className="text-sm text-red-600 text-left">{deleteError}</p>}
                        </div>

                        <div className="mt-5 flex justify-end items-center gap-5">
                            {deleteLoading && (
                                <div className="animate-spin rounded-full h-5 w-5 border-3 border-red-300 border-solid border-t-transparent"></div>
                            )}
                            <ButtonB type="submit" disabled={deleteLoading}>
                                {deleteLoading ? "Deleting..." : "Delete My Account"}
                            </ButtonB>
                        </div>
                    </form>
                </div>
            </motion.div>
            <Footer />
        </>
    );
}

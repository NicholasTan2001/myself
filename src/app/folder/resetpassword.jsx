"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import FontA from "../components/FontA";
import FormInput from "../components/FormInput";
import { useState } from "react";
import ButtonA from "../components/ButtonA";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {

    const [formData, setFormData] = useState({ email: "", temporaryPassword: "", newPassword: "", confirmPassword: "" });
    const [error, setError] = useState({ email: "", temporaryPassword: "", newPassword: "", confirmPassword: "" });
    const [resetting, setResetting] = useState(false);
    const router = useRouter();

    {/* Function: handle reset password form submission */ }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setResetting(true);

        const { email, temporaryPassword, newPassword, confirmPassword } = formData;

        try {
            const res = await fetch("/api/resetpassword", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email
                })
            });

            const data = await res.json();

            if (res.ok) {
                if (!email || String(email).trim().length === 0) {
                    setError({ ...error, email: '* Email address required' });
                    setResetting(false);
                    return;
                }

                if (data.email == null) {
                    setError({ ...error, email: '* Email address not found' });
                    setResetting(false);
                    return;
                }

                if (!temporaryPassword || String(temporaryPassword).trim().length === 0) {
                    setError({ ...error, temporaryPassword: '* Temporary password required' });
                    setResetting(false);
                    return;
                }

                if (data.password == null) {
                    setError({ ...error, temporaryPassword: '* Don\'t have any temporary password for this email' });
                    setResetting(false);
                    return;
                }

                if (temporaryPassword !== data.password) {
                    setError({ ...error, temporaryPassword: '* Temporary password is incorrect' });
                    setResetting(false);
                    return;
                }

                if (!newPassword || String(newPassword).trim().length === 0) {
                    setError({ ...error, newPassword: '* New password required' });
                    setResetting(false);
                    return;
                }

                if (!newPassword || String(newPassword).length < 6) {
                    setError({ ...error, newPassword: '* Password must be at least 6 characters' });
                    setResetting(false);
                    return;
                }

                if (!confirmPassword || String(confirmPassword).trim().length === 0) {
                    setError({ ...error, confirmPassword: '* Confirm password required' });
                    setResetting(false);
                    return;
                }

                if (newPassword !== confirmPassword) {
                    setError({ ...error, confirmPassword: '* Passwords do not match' });
                    setResetting(false);
                    return;
                }

                try {
                    const res2 = await fetch("/api/passwordupdate", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: email,
                            password: newPassword
                        })
                    });

                    const updateData = await res2.json();

                    if (res2.ok && updateData.exist == true) {

                        router.push("/login");

                    }

                } catch (error) {
                    console.error("*Error updating password:", error);
                }
                setResetting(false);
            }

        } catch (error) {
            console.error("*Error fetching data:", error);
            setResetting(false);
        }

    };

    return (

        <div className="flex justify-center items-center min-h-screen p-10">
            {/* Animated card */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-gray-200 bg-opacity-90 rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.8)] p-10 text-center w-full max-w-sm"
            >

                {/* MySelf Logo */}
                <Image
                    src="/myself.png"
                    alt="MySelf Logo"
                    width={150}
                    height={150}
                    className="bg-center mb-3 mx-auto"
                />

                {/* Welcome Text */}
                <FontA>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-7 max-w-full truncate">Reset Password</h1>
                </FontA>

                {/* Reset Password Form */}
                <form onSubmit={handleSubmit}>

                    <div className="flex gap-5 justify-center">
                        <div className="w-full text-sm lg:text-base">
                            <FormInput
                                label="Email Address"
                                type="email"
                                name="email"
                                placeholder="Enter your email "
                                onChange={(e) => {
                                    setError({ ...error, email: "" });
                                    setFormData({ ...formData, email: e.target.value });
                                }}
                            />
                            {error.email && (
                                <p className="text-red-500 text-left text-sm mb-3">
                                    {error.email}
                                </p>
                            )}

                            <FormInput
                                label="Temporary Password"
                                type="password"
                                name="temporaryPassword"
                                placeholder="Enter your temporary password"
                                onChange={(e) => {
                                    setError({ ...error, temporaryPassword: "" });
                                    setFormData({ ...formData, temporaryPassword: e.target.value });
                                }}
                            />
                            {error.temporaryPassword && (
                                <p className="text-red-500 text-left text-sm mb-3">
                                    {error.temporaryPassword}
                                </p>
                            )}

                            <FormInput
                                label="New Password"
                                type="password"
                                name="newPassword"
                                placeholder="Enter your new password"
                                onChange={(e) => {
                                    setError({ ...error, newPassword: "" });
                                    setFormData({ ...formData, newPassword: e.target.value });
                                }}
                            />
                            {error.newPassword && (
                                <p className="text-red-500 text-left text-sm mb-3">
                                    {error.newPassword}
                                </p>
                            )}

                            <FormInput
                                label="Confirm New Password"
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm your new password"
                                onChange={(e) => {
                                    setError({ ...error, confirmPassword: "" });
                                    setFormData({ ...formData, confirmPassword: e.target.value });
                                }}
                            />
                            {error.confirmPassword && (
                                <p className="text-red-500 text-left text-sm mb-3">
                                    {error.confirmPassword}
                                </p>
                            )}

                            <ButtonA type="submit" className="mt-5 w-full" disabled={resetting} >
                                {resetting ? "Resetting..." : "Reset Password"}
                            </ButtonA>
                        </div>
                    </div>


                </form>


            </motion.div>
        </div>
    );
}
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import FormInput from "../components/FormInput";
import ButtonA from "../components/ButtonA";
import FontA from "../components/FontA";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgetPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [sending, setSending] = useState(false);
    const router = useRouter();

    {/* Function: send email to get temporary password */ }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);

        if (!email || String(email).trim().length === 0) {
            setError('* Email address required');
            setSending(false);
            return;
        }

        try {
            const res = await fetch("/api/forgetpassword", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email
                })
            });

            const data = await res.json();

            if (res.ok && data.exists == true) {

                const res2 = await fetch("/api/forgetpasswordupdate", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: email
                    }),
                });

                const data2 = await res2.json();

                const tempPassword = data2.password;

                await fetch("/api/forgetpassword", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: email,
                        subject: "Forget Password ?",
                        text: `Hello user from ${email},

A temporary password has been generated for your account. You can use this password to reset your account password at any time.

For security, each time you request a new temporary password via the "Forget Password" page, your previous temporary password will be invalidated. Please use the most recent temporary password to access your account.

Temporary Password: ${tempPassword}

* To make sure this email is not found by others, you may delete this email after resetting your password. *

Thank you for keeping your account secure.

Best regards,
The MySelf Team`
                    })
                });

                setSending(false);
            } else {
                setError("* Email address not found.");
                setSending(false);
            }

        } catch (err) {
            setSending(false);
            console.error("Error sending email:", err);
            setError("Failed to send email. Please try again later.");
        }

    };

    return (

        <div className="flex justify-center items-center min-h-screen p-10">
            {/* Animated card */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-gray-200 bg-opacity-90 rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.8)] p-10 text-center"
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
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-7 max-w-full truncate">Forget Password ?</h1>
                </FontA>

                <h1 className="font-semibold text-sm lg:text-base text-gray-500 mb-5 mt-5 max-w-sm text-left">
                    * Please insert your valid email address to receive a temporary password to reset your password.
                </h1>

                {/* Temporary Password Form */}
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-5 justify-center">
                        <div className="w-full text-sm lg:text-base">
                            <FormInput
                                label="Valid Email Address"
                                type="email"
                                name={email}
                                placeholder="Enter your valid email address"
                                onChange={(e) => {
                                    setError("");
                                    setEmail(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mt-2 flex justify-end items-center gap-5">
                            {sending && (
                                <div className="animate-spin rounded-full h-5 w-5 border-3 border-blue-300 border-solid border-t-transparent"></div>
                            )}
                            <ButtonA type="submit"> {sending ? "Sending..." : "Send"}</ButtonA>
                        </div>


                    </div>
                    {error && (
                        <p className="text-red-500 text-left text-sm mb-3">
                            {error}
                        </p>
                    )}
                </form>

                <ButtonA onClick={() => router.push('/resetpassword')} className="w-full mt-3">Reset Password Now</ButtonA>
            </motion.div>
        </div>
    );
}
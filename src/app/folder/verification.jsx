"use client";

import Loading from "../components/Loading";
import Timeout from "../components/Timeout";
import FontA from "../components/FontA";
import { motion } from "framer-motion";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation"
import FormInput from "../components/FormInput";
import ButtonA from "../components/ButtonA";

export default function VerificationPage() {

    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [error, setError] = useState("");
    const [otp, setOtp] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    {/* Effect: get data from my switchverify api */ }
    useEffect(() => {
        const fetchSwitchVerifyData = async () => {
            try {
                const res = await fetch("/api/switchverify");
                const data = await res.json();
                if (res.ok) {

                    setOtp(data.code);

                    setUserName(data.name);

                    if (data.code == 0) {
                        router.push('/auth/dashboard');
                        return;
                    }
                }
            } catch (err) {
                console.error("Error fetching switch status");
            }
        };
        fetchSwitchVerifyData();
    }, []);

    {/* Effect: send otp code to email */ }
    useEffect(() => {

        const handleOtpCode = async () => {
            try {
                await fetch("/api/send-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        subject: "Second Verification OTP Code",
                        text: `Hello ${userName},

Your OTP code is ${otp}.

This code is valid for 1 minute only. If the code expires or does not work, the page will automatically refresh after 1 minute to generate a new OTP code.

Please enter the code as soon as possible to complete your verification.

Thank you for your cooperation.

Best regards,
The MySelf Team`
                    })
                });
            } catch {
                console.error("Error sending email status");
            }
        };

        const firstTimer = setTimeout(handleOtpCode, 3000);
        const interval = setInterval(handleOtpCode, 60000);

        return () => {
            clearTimeout(firstTimer);
            clearInterval(interval);
        };

    }, [userName, otp]);

    {/* Effect: send otp code to email */ }
    useEffect(() => {
        const refreshOtp = async () => {
            try {
                const res = await fetch("/api/otpupdate", {
                    method: "PATCH"
                });
                const data = await res.json();
                if (res.ok) {
                    setOtp(data.code);
                }

            } catch (error) {
                console.error("Error updating OTP");
            }
        };

        const interval = setInterval(refreshOtp, 60000);

        return () => clearInterval(interval);

    }, []);

    {/* Effact: make sure first effect is show before 3 seconds */ }
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    {/* Function: verify the otp code */ }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        if (!otpCode || otpCode.trim().length === 0) {
            setError("* OTP code required");
            setSubmitting(false);
            return;
        }

        if (otpCode.trim().length != 4) {
            setError("* OTP code just have 4 digits");
            setSubmitting(false);
            return;
        }

        if (isNaN(otpCode)) {
            setError("* OTP code just can be digits only");
            setSubmitting(false);
            return;
        }

        if (Number(otpCode) == otp) {

            try {
                const res = await fetch("/api/otpdefault", {
                    method: "PATCH"
                });
                if (res.ok) {
                    router.push('/auth/dashboard');
                    return;
                }

            } catch (error) {
                console.error("Error fetching otpdefault status");
                setSubmitting(false);
            }

        } else {

            setError("* OTP code is wrong");
            setSubmitting(false);
            return;

        }

    };

    {/* Function: loading page */ }
    if (loading) return <Loading />;

    return (
        <>
            <main className="flex flex-col max-w-screen-2xl mx-auto">

                <Timeout />

                <div className="flex justify-center items-center min-h-screen p-10">
                    {/* Animated card */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="bg-gray-200 bg-opacity-90 rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.8)] p-10 max-w-lg w-full"
                    >

                        {/* Title */}
                        <FontA>
                            <h1 className="text-center text-xl lg:text-2xl">🛡️ Second Verification</h1>
                        </FontA>

                        <h1 className="font-semibold text-md lg:text-lg text-gray-500 mb-5 mt-5">
                            * Please check your email for the OTP code and enter it to verify your account.
                        </h1>

                        {/* Form to submit otp code */}
                        <form onSubmit={handleSubmit}>
                            <div className="flex gap-5 justify-center">
                                <div className="w-full text-sm lg:text-base">
                                    <FormInput
                                        label="OTP Verification Code"
                                        type="password"
                                        name={otpCode}
                                        placeholder="Enter your OTP Verification Code"
                                        onChange={(e) => {
                                            setError("");
                                            setOtpCode(e.target.value);
                                        }}
                                    />
                                </div>


                                <div className="mt-2 flex justify-end items-center gap-5">
                                    {submitting && (
                                        <div className="animate-spin rounded-full h-5 w-5 border-3 border-blue-300 border-solid border-t-transparent"></div>
                                    )}
                                    <ButtonA type="submit" className=""> {submitting ? "Submitting..." : "Submit"}</ButtonA>
                                </div>

                            </div>
                            {error && (
                                <p className="text-red-500 text-sm">
                                    {error}
                                </p>
                            )}
                        </form>


                    </motion.div>
                </div >
            </main >
        </>
    );
}

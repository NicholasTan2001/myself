"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import FormInput from "../components/FormInput";
import ButtonA from "../components/ButtonA";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password } = formData;

        // Username client-side validation
        if (!name || String(name).trim().length === 0) {
            setNameError('*Username cannot be empty');
            return;
        }

        // Email client-side validation
        const emailStr = String(email || '');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailStr || !emailRegex.test(emailStr)) {
            setEmailError('*Please enter a valid email');
            return;
        }

        // Password client-side validation (min 6 characters)
        if (!password || String(password).length < 6) {
            setPasswordError('*Password must be at least 6 characters');
            return;
        }

        // Confirm password match
        if (formData.confirmPassword !== password) {
            setConfirmError('*Passwords do not match');
            return;
        }

        // Submit to API
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, confirmPassword: formData.confirmPassword }),
            });

            if (res.status === 409) {
                setEmailError('*Email already in use');
                return;
            }

            const data = await res.json();
            if (data?.ok) {
                router.push('/login');
            } else {
                console.error('Register failed', data);
            }
        } catch (err) {
            console.error('Register error', err);
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
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-7 max-w-full truncate">Register to MySelf</h1>

                {/* Register Form */}
                <form onSubmit={handleSubmit}>
                    <div className="w-full mb-4">
                        <FormInput
                            label="Username"
                            type="text"
                            name="name"
                            placeholder="Enter your username"
                            onChange={(e) => { setNameError(''); handleChange(e); }}
                        />
                        {nameError && (
                            <p className="text-sm text-red-600 text-center">{nameError}</p>
                        )}
                    </div>
                    <div className="w-full mb-4">
                        <FormInput
                            label="Email Address"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            onChange={(e) => { setEmailError(''); handleChange(e); }}
                        />
                        {emailError && (
                            <p className="text-sm text-red-600 text-center">{emailError}</p>
                        )}
                    </div>
                    <div className="w-full mb-4">
                        <FormInput
                            label="Password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            onChange={(e) => { setPasswordError(''); handleChange(e); }}
                        />
                        {passwordError && (
                            <p className="text-sm text-red-600 text-center">{passwordError}</p>
                        )}
                    </div>

                    <div className="w-full">
                        <FormInput
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            onChange={(e) => { setConfirmError(''); handleChange(e); }}
                        />
                        {confirmError && (
                            <p className="text-sm text-red-600 text-center">{confirmError}</p>
                        )}
                    </div>

                    <ButtonA
                        type="submit"
                        className="mt-5 w-full"
                    >
                        Register and Login Now
                    </ButtonA>
                </form>

            </motion.div>
        </div>
    );
}
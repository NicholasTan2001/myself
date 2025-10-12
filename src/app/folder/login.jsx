"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import FormInput from "../components/FormInput";
import ButtonA from "../components/ButtonA";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

    const [formData, setFormData] = useState({ email: "", password: "" });
    const router = useRouter();
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;

        if (!email || String(email).trim().length === 0) {
            setEmailError('*Email address required');
            return;
        }
        if (!password || String(password).length === 0) {
            setPasswordError('*Password required');
            return;
        }

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                router.push('/auth/dashboard');
                return;
            }

            if (res.status === 401) {
                setPasswordError('*Invalid credentials');
                return;
            }

            const data = await res.json();
            if (data?.error) {
                if (data.error.includes('Email')) setEmailError(data.error);
                else setPasswordError(data.error);
            }
        } catch (err) {
            console.error('Login error', err);
            setPasswordError('*Login failed');
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
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-7 max-w-full truncate">Continue to MySelf</h1>

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                    <div className="w-full mb-4">
                        <FormInput
                            label="Email Address"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            onChange={(e) => { setEmailError(''); handleChange(e); }}
                        />
                        {emailError && <p className="text-sm text-red-600 text-center">{emailError}</p>}
                    </div>

                    <div className="w-full">
                        <FormInput
                            label="Password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            onChange={(e) => { setPasswordError(''); handleChange(e); }}
                        />
                        {passwordError && <p className="text-sm text-red-600 text-center">{passwordError}</p>}
                    </div>

                    <ButtonA
                        type="submit"
                        className="mt-5"
                    >
                        Login
                    </ButtonA>
                </form>

                <ButtonA
                    type="button"
                    className="mt-5"
                    onClick={() => router.push('/register')}
                >
                    Register Now
                </ButtonA>

            </motion.div>
        </div>
    );
}

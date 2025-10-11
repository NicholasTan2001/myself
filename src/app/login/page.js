"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import FormInput from "../components/FormInput";
import ButtonA from "../components/ButtonA";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {

  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (

    <div className="flex justify-center items-center min-h-screen p-10">
      {/* Animated card */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
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
        <h1 className="text-3xl font-bold text-gray-800 mb-7">Continue to MySelf</h1>

        {/* Login Form */}
        <form>
          <FormInput
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
          />
          <FormInput
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
          />

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

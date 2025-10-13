"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
    const [activeLink, setActiveLink] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [showNav, setShowNav] = useState(false); // Navbar animation
    const [showMenu, setShowMenu] = useState(false); // Mobile menu animation

    useEffect(() => {
        setShowNav(true); // fade-down navbar
    }, []);

    useEffect(() => {
        if (menuOpen) {
            // Trigger animation slightly after menuOpen
            const timer = setTimeout(() => setShowMenu(true), 10);
            return () => clearTimeout(timer);
        } else {
            setShowMenu(false);
        }
    }, [menuOpen]);

    const linkClass = (linkName) => `
        relative px-4 py-2 overflow-hidden rounded group font-medium transition-colors duration-800
        ${activeLink === linkName ? "text-blue-300" : "text-gray-400"}
    `;

    const innerTextClass = `
        relative z-10 group-hover:text-white transition-colors duration-500 font-semibold
    `;

    const rippleSpan = `
        absolute top-1/2 left-1/3 w-0 h-0 bg-blue-300 rounded-full transition-all duration-800 ease-out
        group-hover:w-[150%] group-hover:h-[500%] group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 z-0
    `;

    return (
        <nav
            className={`
                bg-white font-semibold bg-opacity-90 shadow-[0_0_25px_rgba(255,255,255,0.8)]
                transition-all duration-700 ease-out
                ${showNav ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}
            `}
        >
            <div className="max-w-7xl mx-auto px-5 py-2 flex items-center justify-between">
                {/* Left: Logo + Links */}
                <div className="flex items-center space-x-12">
                    <div className="flex items-center space-x-4">
                        <Image
                            src="/myself.png"
                            alt="MySelf Logo"
                            width={45}
                            height={45}
                            className="rounded-full"
                        />
                        <h1 className="text-2xl font-semibold tracking-wide">MySelf</h1>
                    </div>

                    <div className="hidden md:flex items-center space-x-2">
                        <Link
                            href="/auth/dashboard"
                            onClick={() => setActiveLink("dashboard")}
                            className={linkClass("dashboard")}
                        >
                            <span className={rippleSpan}></span>
                            <span className={innerTextClass}>Dashboard</span>
                        </Link>

                        <Link
                            href="/about"
                            onClick={() => setActiveLink("about")}
                            className={linkClass("about")}
                        >
                            <span className={rippleSpan}></span>
                            <span className={innerTextClass}>About Us</span>
                        </Link>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center">
                    <div className="hidden md:block">
                        <LogoutButton />
                    </div>
                    <div className="md:hidden">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-gray-500 focus:outline-none"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`
                    md:hidden px-5 flex flex-col space-y-1 bg-white shadow-[0_0_25px_rgba(255,255,255,0.8)]
                    transition-all duration-600 ease-out overflow-hidden
                    ${menuOpen && showMenu ? "opacity-100 max-h-80 translate-y-0" : "opacity-0 max-h-0 -translate-y-5"}
                `}
            >
                <Link
                    href="/auth/dashboard"
                    onClick={() => { setActiveLink("dashboard"); setMenuOpen(false); }}
                    className={linkClass("dashboard")}
                >
                    <span className={rippleSpan}></span>
                    <span className={innerTextClass}>Dashboard</span>
                </Link>

                <Link
                    href="/about"
                    onClick={() => { setActiveLink("about"); setMenuOpen(false); }}
                    className={linkClass("about")}
                >
                    <span className={rippleSpan}></span>
                    <span className={innerTextClass}>About Us</span>
                </Link>

                <div className="p-5 ml-20 mr-20 flex flex justify-center">
                    <LogoutButton />
                </div>
            </div>
        </nav>
    );
}

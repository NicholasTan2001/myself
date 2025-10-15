"use client";
import { Patua_One } from "next/font/google";

const patuaOne = Patua_One({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
});

export default function FontA({ children }) {
    return <div className={patuaOne.className}>{children}</div>;
}

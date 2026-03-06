import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma";

{/* Function: send otp code to user email */ }
export async function POST(req) {
    try {

        {/* Subject and text from UI */ }
        const { subject, text } = await req.json();

        {/* Admin Account Details */ }
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
        });

        {/* Token Verification */ }
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "*No token found" }, { status: 401 });
        }

        {/* userId is taken from token */ }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");

        {/* Get data from User */ }
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        {/* Receiver Account Details */ }
        const info = await transporter.sendMail({
            from: `"MySelf" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: subject || "Test Email",
            text: text || "Test Email",
        });

        console.log("Message sent:", info.messageId);
        return new Response(JSON.stringify({ success: true, messageId: info.messageId }), { status: 200 });

    } catch (err) {
        console.error("Email sending error:", err);
        return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
    }
}
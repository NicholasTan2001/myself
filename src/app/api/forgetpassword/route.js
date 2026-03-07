import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import nodemailer from "nodemailer";

export async function PATCH(request) {
    try {

        {/*Data from request*/ }
        const body = await request.json();
        const { email } = body;

        {/* Search user by email */ }
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        {/* If user exists */ }
        if (user) {
            return NextResponse.json({ exists: true });
        }

        {/* If  user doesnst exist */ }
        return NextResponse.json({ exists: false });

    } catch (err) {
        console.error('*API /api/forgetpassword PATCH error:', err);
        return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
    }
}

{/* Function: send temporarily to user email */ }
export async function POST(req) {
    try {

        {/* email, subject and text from UI */ }
        const { email, subject, text } = await req.json();

        {/* Admin Account Details */ }
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
        });

        {/* Receiver Account Details */ }
        const info = await transporter.sendMail({
            from: `"MySelf" <${process.env.EMAIL_USER}>`,
            to: email,
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
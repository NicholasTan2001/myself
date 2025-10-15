import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token)
            return NextResponse.json({ error: "*No token found" }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
        const body = await req.json();
        const { password } = body;

        if (!password) {
            return NextResponse.json({ error: "*Password is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user)
            return NextResponse.json({ error: "*User not found" }, { status: 404 });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return NextResponse.json({ error: "*Incorrect password" }, { status: 401 });

        await prisma.user.delete({
            where: { id: decoded.userId },
        });

        const res = NextResponse.json({
            message: "*Account deleted successfully",
        });

        res.cookies.set("token", "", {
            httpOnly: true,
            maxAge: 0,
            path: "/",
        });

        return res;
    } catch (err) {
        console.error("*Error deleting account:", err);
        return NextResponse.json({ error: "*Error deleting account" }, { status: 500 });
    }
}

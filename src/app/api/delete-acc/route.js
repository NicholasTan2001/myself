import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

{/* Function: delete account */ }
export async function POST(req) {
    try {

        {/* Token Verification */ }
        const token = req.cookies.get("token")?.value;
        if (!token)
            return NextResponse.json({ error: "*No token found" }, { status: 401 });

        {/* userId is taken from token and get data from .jsx page */ }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
        const body = await req.json();
        const { password } = body;

        {/* Password is required */ }
        if (!password) {
            return NextResponse.json({ error: "*Password is required" }, { status: 400 });
        }

        {/* Get user */ }
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        {/* User not found */ }
        if (!user)
            return NextResponse.json({ error: "*User not found" }, { status: 404 });

        {/* Comparison password */ }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return NextResponse.json({ error: "*Incorrect password" }, { status: 401 });

        {/* Delete record */ }
        await prisma.record.deleteMany({
            where: { userId: decoded.userId },
        });
        {/* Delete Daily List */ }
        await prisma.dailyList.deleteMany({
            where: { userId: decoded.userId },
        });

        {/* Delete Special List */ }
        await prisma.specialList.deleteMany({
            where: { userId: decoded.userId },
        });

        {/* Delete user */ }
        await prisma.user.delete({
            where: { id: decoded.userId },
        });

        const res = NextResponse.json({
            message: "*Account and all tasks deleted successfully",
        });

        {/* Set the token become null */ }
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

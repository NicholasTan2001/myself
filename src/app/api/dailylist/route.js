import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "*No token found" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");

        const { name, remark } = await req.json();

        if (!name || !remark) {
            return NextResponse.json({ error: "*Name and remark are required" }, { status: 400 });
        }

        const newTask = await prisma.dailyList.create({
            data: {
                name,
                remark,
                userId: decoded.userId,
            },
        });

        return NextResponse.json({
            message: "*Task added successfully",
            task: newTask,
        });
    } catch (error) {
        console.error("*Error adding daily task:", error);
        return NextResponse.json({ error: "*Failed to add daily task" }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "*No token found" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");

        const dailyTasks = await prisma.dailyList.findMany({
            where: { userId: decoded.userId },
            select: { id: true, name: true, remark: true },
        });

        return NextResponse.json({ dailyTasks });
    } catch (error) {
        console.error("*Error fetching tasks:", error);
        return NextResponse.json({ error: "*Invalid or expired token" }, { status: 401 });
    }
}

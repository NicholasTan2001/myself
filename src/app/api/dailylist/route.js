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
            return NextResponse.json({ error: "*Both fields are required" }, { status: 400 });
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

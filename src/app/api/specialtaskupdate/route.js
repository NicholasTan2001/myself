import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma";

{/* Function: update special to-do list */ }
export async function PATCH(req) {

    try {

        {/* Get Malaysia current date */ }
        const now = new Date();
        const malaysiaOffset = 8 * 60;
        const malaysiaDate = new Date(now.getTime() + malaysiaOffset * 60 * 1000);

        {/* Token Verification */ }
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "*No token found" }, { status: 401 });
        }

        {/* userId is taken from token and get data from .jsx page */ }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
        const { id, name, remark, date, week } = await req.json();

        {/* Date Format */ }
        let validDate = null;
        if (date?.trim()) {
            const d = new Date(date);
            d.setUTCHours(0, 0, 0, 0);
            validDate = d.toISOString();
        }

        {/* Name and remark can't be null */ }
        if (!name || !remark) {
            return NextResponse.json({ error: "*Name and remark are required" }, { status: 400 });
        }

        {/* Update Special List */ }
        const updatedTask = await prisma.specialList.update({
            where: {
                id: id,
                userId: decoded.userId,
            },
            data: {
                name,
                remark,
                date: validDate,
                week: week,
                userId: decoded.userId,
                updatedAt: malaysiaDate
            },
            select: { id: true, name: true, remark: true, date: true, week: true }
        });

        return NextResponse.json({ task: updatedTask });
    } catch (error) {
        console.error("*Error updating special task:", error);
        return NextResponse.json({ error: "*Error updating special task" }, { status: 500 });
    }
}

{/* Function: delete special to-do list */ }
export async function DELETE(req) {
    try {
        {/* Token Verification */ }
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "*No token found" }, { status: 401 });
        }

        {/* userId is taken from token and get data from .jsx page */ }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
        const { id } = await req.json();

        {/* Delete Special List */ }
        const deletedTask = await prisma.specialList.deleteMany({
            where: { id, userId: decoded.userId },
        });

        {/* Nothing for delete */ }
        if (deletedTask.count === 0) {
            return NextResponse.json({ error: "*Task not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("*Error deleting task:", error);
        return NextResponse.json({ error: "*Error deleting task" }, { status: 500 });
    }
}
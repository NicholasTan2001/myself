import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma";

{/* Function: update daily to-do list */ }
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
        const { id, name, remark } = await req.json();
        const updateData = { id, name, remark, updatedAt: malaysiaDate };

        {/* Name and remark can't be null */ }
        if (!name || !remark) {
            return NextResponse.json({ error: "*Name and remark are required" }, { status: 400 });
        }

        {/* Update Daily List */ }
        const task = await prisma.dailyList.update({
            where: {
                id: id,
                userId: decoded.userId,
            },
            data: updateData,
            select: { id: true, name: true, remark: true, updatedAt: true },
        });

        return NextResponse.json({ task });

    } catch (error) {
        console.error("*Error updating task:", error);
        return NextResponse.json({ error: "*Error updating task" }, { status: 500 });
    }
}

{/* Function: delete daily to-do list */ }
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

        {/* Delete Daily List */ }
        const deletedTask = await prisma.dailyList.deleteMany({
            where: { id, userId: decoded.userId },
        });

        {/* Delete Daily List */ }
        if (deletedTask.count === 0) {
            return NextResponse.json({ error: "*Task not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("*Error deleting task:", error);
        return NextResponse.json({ error: "*Error deleting task" }, { status: 500 });
    }
}

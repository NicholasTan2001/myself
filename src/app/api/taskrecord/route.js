import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token)
            return NextResponse.json({ error: "*No token found" }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
        const userId = decoded.userId;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dailyToReset = await prisma.dailyList.findMany({
            where: {
                userId,
                updatedAt: { lt: today },
            },
        });

        const specialToReset = await prisma.specialList.findMany({
            where: {
                userId,
                updatedAt: { lt: today },
            },
        });

        await prisma.dailyList.updateMany({
            where: { userId, updatedAt: { lt: today } },
            data: {
                check: null,
                updatedAt: new Date(),
            },
        });

        await prisma.specialList.updateMany({
            where: { userId, updatedAt: { lt: today } },
            data: {
                check: null,
                updatedAt: new Date(),
            },
        });

        if (dailyToReset.length > 0) {
            const dailyRecords = dailyToReset.map((task) => ({
                name: task.name,
                remark: task.remark,
                date: task.updatedAt,
                type: "dailylist",
                check: task.check ?? null,
                listId: task.id,
                userId,
            }));

            await prisma.record.createMany({
                data: dailyRecords,
            });
        }

        if (specialToReset.length > 0) {
            const specialRecords = specialToReset.map((task) => ({
                name: task.name,
                remark: task.remark,
                date: task.updatedAt,
                type: "speciallist",
                check: task.check ?? null,
                listId: task.id,
                userId,
            }));

            await prisma.record.createMany({
                data: specialRecords,
            });
        }

        const dailyTasks = await prisma.dailyList.findMany({ where: { userId } });
        const specialTasks = await prisma.specialList.findMany({ where: { userId } });

        return NextResponse.json({
            message: "*Tasks reset successfully and records created",
            dailyTasks,
            specialTasks,
        });
    } catch (err) {
        console.error("*Error resetting task records:", err);
        return NextResponse.json({ error: "*Failed to reset task records" }, { status: 500 });
    }
}

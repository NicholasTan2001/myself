import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

{/* Function: check and store task record */ }
export async function GET(req) {

    try {

        {/* Token Verification */ }
        const token = req.cookies.get("token")?.value;
        if (!token)
            return NextResponse.json({ error: "*No token found" }, { status: 401 });

        {/* userId is taken from token and get data from .jsx page */ }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
        const userId = decoded.userId;

        {/* Get today date with format */ }
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        {/* Find and check daily list update date */ }
        const dailyToReset = await prisma.dailyList.findMany({
            where: { userId, updatedAt: { lt: today } },
        });

        {/* Find and check special list update date */ }
        const specialToReset = await prisma.specialList.findMany({
            where: { userId, updatedAt: { lt: today } },
        });

        const dailyRecords = [];
        const specialRecords = [];

        {/* Check and update daily list record*/ }
        for (const task of dailyToReset) {
            let tempDate = new Date(task.updatedAt);
            tempDate.setUTCHours(0, 0, 0, 0);

            while (tempDate < today) {
                dailyRecords.push({
                    name: task.name,
                    remark: task.remark,
                    date: new Date(tempDate),
                    type: "dailylist",
                    check: task.check ?? null,
                    listId: task.id,
                    userId,
                });
                tempDate.setUTCDate(tempDate.getUTCDate() + 1);
            }

            await prisma.dailyList.update({
                where: { id: task.id },
                data: {
                    check: null,
                    updatedAt: new Date(),
                },
            });
        }

        {/* Check and update special list record*/ }
        for (const task of specialToReset) {
            let tempDate = new Date(task.updatedAt);
            tempDate.setUTCHours(0, 0, 0, 0);

            while (tempDate < today) {
                specialRecords.push({
                    name: task.name,
                    remark: task.remark,
                    date: new Date(tempDate),
                    type: "speciallist",
                    check: task.check ?? null,
                    listId: task.id,
                    userId,
                });
                tempDate.setUTCDate(tempDate.getUTCDate() + 1);
            }

            await prisma.specialList.update({
                where: { id: task.id },
                data: {
                    check: null,
                    updatedAt: new Date(),
                },
            });
        }

        {/* Create all new daily list record*/ }
        if (dailyRecords.length > 0) {
            await prisma.record.createMany({ data: dailyRecords });
        }
        {/* Create all new special list record*/ }
        if (specialRecords.length > 0) {
            await prisma.record.createMany({ data: specialRecords });
        }

        const dailyTasks = await prisma.dailyList.findMany({ where: { userId } });
        const specialTasks = await prisma.specialList.findMany({ where: { userId } });

        return NextResponse.json({
            message: "*Tasks reset successfully and missing-day records created",
            dailyTasks,
            specialTasks,
        });
    } catch (err) {
        console.error("*Error resetting task records:", err);
        return NextResponse.json(
            { error: "*Failed to reset task records" },
            { status: 500 }
        );
    }
}

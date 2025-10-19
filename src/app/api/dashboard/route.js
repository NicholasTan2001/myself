import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "*No token found" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");

        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const todayWeek = new Date().toLocaleDateString("en-MY", { weekday: "long" });

        const dailyTasks = await prisma.dailyList.findMany({
            where: { userId: decoded.userId },
            select: { id: true, name: true, remark: true },
        });

        const specialTasks = await prisma.specialList.findMany({
            where: {
                userId: decoded.userId,
                OR: [
                    {
                        date: {
                            gte: startOfDay,
                            lte: endOfDay,
                        },
                    },
                    {
                        week: todayWeek,
                    },
                ],
            },
            select: { id: true, name: true, remark: true, date: true, week: true },
        });

        return NextResponse.json({ dailyTasks, specialTasks });
    } catch (error) {
        console.error("*Error fetching tasks:", error);
        return NextResponse.json({ error: "*Invalid or expired token" }, { status: 401 });
    }
}

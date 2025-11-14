import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

{/* Function: get Daily List and Special List */ }
export async function GET(req) {
    try {

        {/* Token Verification */ }
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "*No token found" }, { status: 401 });
        }

        {/* userId is taken from token */ }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");

        {/* Get today date with format */ }
        const now = new Date();
        const malaysiaOffset = 8 * 60;
        const today = new Date(now.getTime() + malaysiaOffset * 60 * 1000);
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        {/* Get today day with format */ }
        const todayWeek = new Date().toLocaleDateString("en-MY", { weekday: "long" });

        {/* Get Daily List */ }
        const dailyTasks = await prisma.dailyList.findMany({
            where: { userId: decoded.userId },
            select: { id: true, name: true, remark: true, check: true },
        });

        {/* Get Special List */ }
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
            select: { id: true, name: true, remark: true, date: true, week: true, check: true },
        });

        return NextResponse.json({ dailyTasks, specialTasks });
    } catch (error) {
        console.error("*Error fetching tasks:", error);
        return NextResponse.json({ error: "*Invalid or expired token" }, { status: 401 });
    }
}

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

        const dailyRecords = await prisma.record.findMany({
            where: {
                userId,
                type: "dailylist",
            },
            orderBy: { date: "asc" },
        });

        const countsByDate = dailyRecords.reduce((acc, record) => {
            const date = new Date(record.date).toISOString().split("T")[0];

            if (!acc[date]) acc[date] = { total: 0, trueCount: 0 };

            acc[date].total += 1;
            if (record.check === "true") acc[date].trueCount += 1;

            return acc;
        }, {});

        const data = Object.entries(countsByDate)
            .sort(([a], [b]) => new Date(a) - new Date(b))
            .map(([date, { total, trueCount }]) => ({
                date,
                total,
                trueCount,
                percentage: total > 0 ? Math.round((trueCount / total) * 100) : 0,
            }));

        return NextResponse.json({ data });
    } catch (err) {
        console.error("*Error fetching dailylist records:", err);
        return NextResponse.json(
            { error: "*Failed to fetch dailylist records" },
            { status: 500 }
        );
    }
}

import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

{/* Function: sort and create special to-do list frequency chart */ }
export async function GET(req) {
    try {

        {/* Token Verification */ }
        const token = req.cookies.get("token")?.value;
        if (!token)
            return NextResponse.json({ error: "*No token found" }, { status: 401 });

        {/* userId is taken from token and get data from .jsx page */ }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
        const userId = decoded.userId;

        {/* Get all the speciallist type of data from record */ }
        const specialRecords = await prisma.record.findMany({
            where: {
                userId,
                type: "speciallist",
            },
            orderBy: { date: "asc" },
        });

        {/* Get the spesific range of date from the sepciallist record */ }
        const countsByDate = specialRecords.reduce((acc, record) => {
            const date = new Date(record.date).toISOString().split("T")[0];

            if (!acc[date]) acc[date] = { total: 0, trueCount: 0 };

            acc[date].total += 1;
            if (record.check === "true") acc[date].trueCount += 1;

            return acc;
        }, {});

        {/* Map and sort the data correctly */ }
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
        console.error("*Error fetching speciallist records:", err);
        return NextResponse.json(
            { error: "*Failed to fetch speciallist records" },
            { status: 500 }
        );
    }
}

import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req) {
    try {

        {/* Token Verification */ }
        const token = req.cookies.get("token")?.value;
        if (!token)
            return NextResponse.json({ error: "*No token found" }, { status: 401 });

        {/* userId is taken from token and get data from .jsx page */ }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
        const userId = decoded.userId;

        {/* Get data from report page */ }
        const { searchParams } = new URL(req.url);
        const from = new Date(searchParams.get("from"));
        const to = new Date(searchParams.get("to"));
        const type = searchParams.get("type") || "None";

        {/* Get data from ... to ... */ }
        let whereCondition = {
            userId,
            date: { gte: from, lte: to },
        };

        {/* Verity type from Report table */ }
        if (type === "Daily List") {
            whereCondition.type = "dailylist";
        } else if (type === "Special List") {
            whereCondition.type = "speciallist";
        }

        {/* Get data from table according to which type of list*/ }
        const records = await prisma.record.findMany({
            where: whereCondition,
            orderBy: { date: "asc" },
        });

        return NextResponse.json({ records });
    } catch (err) {
        console.error("*Error fetching report:", err);
        return NextResponse.json({ error: "*Failed to fetch report" }, { status: 500 });
    }
}

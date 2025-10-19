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

        const { name, remark, date, week } = await req.json();

        if (!name || !remark) {
            return NextResponse.json({ error: "*Name and remark are required" }, { status: 400 });
        }

        const validWeek = week === "None" ? null : week?.trim() || null;
        const validDate = date?.trim() ? new Date(date) : null;

        if (!validDate && !validWeek) {
            return NextResponse.json({
                error: "*Please select at least a date or a week.",
            }, { status: 400 });
        }

        const newSpecial = await prisma.specialList.create({
            data: {
                name,
                remark,
                date: validDate,
                week: validWeek,
                userId: decoded.userId,
            },
        });

        return NextResponse.json({
            message: "*Special task added successfully",
            task: newSpecial,
        });

    } catch (error) {
        console.error("*Error adding special task:", error);
        return NextResponse.json({ error: "*Failed to add special task" }, { status: 500 });
    }
}

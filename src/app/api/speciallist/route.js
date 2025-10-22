import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

{/* Function: create Special List */ }
export async function POST(req) {
    try {
        {/* Token Verification */ }
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "*No token found" }, { status: 401 });
        }

        {/* userId is taken from token and get data from .jsx page */ }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
        const { name, remark, date, week } = await req.json();

        {/* Name and remark can't be null */ }
        if (!name || !remark) {
            return NextResponse.json({ error: "*Name and remark are required" }, { status: 400 });
        }

        {/* Date and Week format is verified */ }
        const validWeek = week === "None" ? null : week?.trim() || null;
        const validDate = date?.trim() ? new Date(date) : null;

        {/* Date or Week is required */ }
        if (!validDate && !validWeek) {
            return NextResponse.json({
                error: "*Please select at least a date or a week.",
            }, { status: 400 });
        }

        {/* Add Special List */ }
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

{/* Function: get Special List */ }
export async function GET(req) {
    try {

        {/* Token Verification */ }
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "*No token found" }, { status: 401 });
        }

        {/* userId is taken from token */ }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");

        {/* Get Special List */ }
        const specialTasks = await prisma.specialList.findMany({
            where: { userId: decoded.userId },
            select: { id: true, name: true, remark: true, date: true, week: true },
        });

        return NextResponse.json({ specialTasks });
    } catch (error) {
        console.error("*Error fetching tasks:", error);
        return NextResponse.json({ error: "*Invalid or expired token" }, { status: 401 });
    }
}


import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma";

export async function POST(req) {
    try {

        {/* Token Verification */ }
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "*No token found" }, { status: 401 });
        }

        {/* userId is taken from token and get data from .jsx page */ }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
        const { id, check } = await req.json();

        {/* Set check status in Daily List */ }
        await prisma.dailyList.update({
            where: {
                id: id,
                userId: decoded.userId,
            },

            data: { check }
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Error updating check:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

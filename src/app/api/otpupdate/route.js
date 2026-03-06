import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma";

{/* Function: update otp data */ }
export async function PATCH(req) {
    try {

        {/* Token Verification */ }
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "*No token found" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");

        {/* Get Malaysia current date */ }
        const now = new Date();
        const malaysiaOffset = 8 * 60;
        const malaysiaDate = new Date(now.getTime() + malaysiaOffset * 60 * 1000);

        {/* Random otp code */ }
        const otp = Math.floor(1000 + Math.random() * 9000);

        {/* Get data from User */ }
        const existing = await prisma.verification.findFirst({
            where: { userId: decoded.userId },
        });

        let result;

        {/* Update Verification when user is exist */ }
        if (existing) {

            result = await prisma.verification.update({
                where: { id: existing.id },
                data: {
                    code: otp,
                    updatedAt: malaysiaDate
                },

            });

        }

        return NextResponse.json({ code: result?.code ?? 0 });
    } catch (err) {
        console.error("Error updating verification:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}


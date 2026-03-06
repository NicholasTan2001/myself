import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma";

{/* Function: get switch verify data */ }
export async function GET(req) {
    try {

        {/* Token Verification */ }
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "*No token found" }, { status: 401 });
        }

        {/* userId is taken from token */ }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");

        {/* Get data from User*/ }
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "*User not found" }, { status: 404 });
        }

        {/* Get data from Switch*/ }
        const verification = await prisma.verification.findFirst({
            where: {
                userId: user.id,
            },
            select: {
                id: true,
                code: true,
                active: true,
            },
        });

        return NextResponse.json({
            active: verification?.active === "Yes" ?? false,
            code: verification?.code ?? 0,
            name: user?.name ?? null
        });
    } catch (error) {
        console.error("*Error fetching user:", error);
        return NextResponse.json({ error: "*Invalid or expired token" }, { status: 401 });
    }
}

{/* Function: update switch verify data */ }
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

        {/* Get data from UI */ }
        const body = await req.json();

        const activeStatus = body.active ? "Yes" : "No";

        {/* Get data from User */ }
        const existing = await prisma.verification.findFirst({
            where: { userId: decoded.userId },
        });

        let result;

        {/* Create new data when not exist in Verification, otherwise, update Verification */ }
        if (!existing) {
            result = await prisma.verification.create({
                data: {
                    userId: decoded.userId,
                    active: activeStatus,
                    code: 0,
                    createdAt: malaysiaDate,
                    updatedAt: malaysiaDate
                },
            });
        } else {
            result = await prisma.verification.update({
                where: { id: existing.id },
                data: {
                    active: activeStatus,
                    updatedAt: malaysiaDate
                },

            });
        }

        return NextResponse.json({ active: result.active === "Yes" });
    } catch (err) {
        console.error("Error updating verification:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}


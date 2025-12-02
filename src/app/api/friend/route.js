import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

{/* Function: add friend */ }
export async function POST(req) {
    try {

        {/* Get Malaysia current date */ }
        const now = new Date();
        const malaysiaOffset = 8 * 60;
        const malaysiaDate = new Date(now.getTime() + malaysiaOffset * 60 * 1000);

        {/* Token Verification */ }
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "*No token found" }, { status: 401 });
        }
        {/* userId is taken from token and get data from .jsx page */ }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
        const { friendID } = await req.json();
        const friendId = Number(friendID);

        {/* Create new relation */ }
        const relation = await prisma.relation.create({
            data: {
                friendId: friendId,
                userId: decoded.userId,
                type: "friend",
                createdAt: malaysiaDate,
                updatedAt: malaysiaDate
            },
        });

        return NextResponse.json(relation);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

{/* Function: get relation */ }
export async function GET(req) {
    try {

        {/* Token Verification */ }
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "*No token found" }, { status: 401 });
        }
        {/* userId is taken from token */ }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");

        {/* get data from Relation */ }
        const relation = await prisma.relation.findMany({
            where: { userId: decoded.userId },
            select: {
                id: true,
                type: true,
                friendId: true
            },
        });

        {/* get data from User */ }
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
            },
        });

        return NextResponse.json({
            relation,
            users,
        });

    } catch (error) {
        console.error("*Error fetching tasks:", error);
        return NextResponse.json({ error: "*Invalid or expired token" }, { status: 401 });
    }
}

{/* Function: delete relation */ }
export async function DELETE(req) {
    try {

        {/* Token Verification */ }
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "*No token found" }, { status: 401 });
        }

        {/* userId is taken from token */ }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");

        {/* Get data from .jsx page */ }
        const { friendID } = await req.json();

        {/* Check data is exist in Relation*/ }
        const existingRelation = await prisma.relation.findFirst({
            where: {
                userId: decoded.userId,
                friendId: friendID,
            },
        });

        {/* Delete data in  Relation*/ }
        await prisma.relation.delete({
            where: {
                id: existingRelation.id,
            },
        });

        return NextResponse.json({ message: "Friend deleted successfully" });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "*Server error" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

{/* Function: get Friend Note data */ }
export async function GET(req) {
    try {

        {/* Token Verification */ }
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "*No token found" }, { status: 401 });
        }

        {/* userId is taken from token */ }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");

        {/* Get Note */ }
        const friendNoteData = await prisma.friendNote.findMany({
            where: {
                OR: [
                    { userId: decoded.userId },
                    { friendId: decoded.userId }
                ]
            },
            select: { id: true, name: true, type: true, friendId: true, userId: true },
        });

        {/* get data from User */ }
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
            },
        });

        return NextResponse.json({ friendNoteData, users });
    } catch (error) {
        console.error("*Error fetching tasks:", error);
        return NextResponse.json({ error: "*Invalid or expired token" }, { status: 401 });
    }
}

{/* Function: add new friend note */ }
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
        let { name, type, friendId } = await req.json();

        {/* Important will set None if null happen */ }
        if (type == "") {
            type = "None";
        }

        {/* Note name can't be null */ }
        if (!name) {
            return NextResponse.json({ error: "*Name is required" }, { status: 400 });
        }

        {/* Create new note */ }
        const newFriendNote = await prisma.friendNote.create({
            data: {
                name,
                type,
                friendId,
                userId: decoded.userId,
                createdAt: malaysiaDate,
                updatedAt: malaysiaDate
            },
        });

        return NextResponse.json({
            message: "*Friend note added successfully",
            task: newFriendNote,
        });
    } catch (error) {
        console.error("*Error adding note:", error);
        return NextResponse.json({ error: "*Failed to add note" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

{/* Function: get friend Note data */ }
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
            where:
                { userId: decoded.userId },

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

{/* Function: update friend note */ }
export async function PATCH(req) {
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
        const { id, name, type, friendId } = await req.json();
        const updateData = { id, name, type, updatedAt: malaysiaDate, friendId };

        {/* Update Note */ }
        const friendNote = await prisma.friendNote.update({
            where: {
                id: id,
                userId: decoded.userId,
            },
            data: updateData,
            select: { id: true, name: true, type: true, updatedAt: true, friendId: true },
        });

        return NextResponse.json({ friendNote });

    } catch (error) {
        console.error("*Error updating task:", error);
        return NextResponse.json({ error: "*Error updating task" }, { status: 500 });
    }
}

{/* Function: delete friend note */ }
export async function DELETE(req) {
    try {

        {/* Token Verification */ }
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "*No token found" }, { status: 401 });
        }

        {/* userId is taken from token and get data from .jsx page */ }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
        const { id } = await req.json();

        {/* Delete note */ }
        const deletedFriendNote = await prisma.friendNote.deleteMany({
            where: { id, userId: decoded.userId },
        });

        {/* Error if note not found */ }
        if (deletedFriendNote.count === 0) {
            return NextResponse.json({ error: "*Note not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error("*Error deleting task:", error);
        return NextResponse.json({ error: "*Error deleting task" }, { status: 500 });
    }
}
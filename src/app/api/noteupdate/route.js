import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma";

{/* Function: update note */ }
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
        const { id, name, important } = await req.json();
        const updateData = { id, name, important, updatedAt: malaysiaDate };

        {/* Update Note */ }
        const note = await prisma.note.update({
            where: {
                id: id,
                userId: decoded.userId,
            },
            data: updateData,
            select: { id: true, name: true, important: true, updatedAt: true },
        });

        return NextResponse.json({ note });

    } catch (error) {
        console.error("*Error updating task:", error);
        return NextResponse.json({ error: "*Error updating task" }, { status: 500 });
    }
}

{/* Function: delete note */ }
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
        const deletedNote = await prisma.note.deleteMany({
            where: { id, userId: decoded.userId },
        });

        {/* Error if note not found */ }
        if (deletedNote.count === 0) {
            return NextResponse.json({ error: "*Note not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error("*Error deleting task:", error);
        return NextResponse.json({ error: "*Error deleting task" }, { status: 500 });
    }
}
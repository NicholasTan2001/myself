import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

{/* Function: update user password */ }
export async function PATCH(req) {
    try {

        {/* Get Malaysia current date */ }
        const now = new Date();
        const malaysiaOffset = 8 * 60;
        const malaysiaDate = new Date(now.getTime() + malaysiaOffset * 60 * 1000);

        {/* Get data from UI */ }
        const body = await req.json();
        const { email, password } = body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const passwordUpdate = hashedPassword;

        {/* update User */ }
        const result = await prisma.user.update({
            where: { email: email },
            data: { password: passwordUpdate, updatedAt: malaysiaDate },
            select: { password: true, updatedAt: true },
        });

        let exist = false;

        if (result) {
            exist = true;
        }

        return NextResponse.json({ exist: exist });
    } catch (error) {
        console.error("*Error updating profile:", error);
        return NextResponse.json({ error: "*Error updating profile" }, { status: 500 });
    }
}

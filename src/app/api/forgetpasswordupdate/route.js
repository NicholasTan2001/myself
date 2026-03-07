import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

{/* Function: update temporary passsword */ }
export async function PATCH(req) {
    try {

        {/* Get email from UI */ }
        const { email } = await req.json();

        {/* Get Malaysia current date */ }
        const now = new Date();
        const malaysiaOffset = 8 * 60;
        const malaysiaDate = new Date(now.getTime() + malaysiaOffset * 60 * 1000);

        {/* Random temporary password */ }
        const tempPassword = Math.floor(100000 + Math.random() * 900000);

        {/* Get data from User */ }
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        {/* Check temporary password record */ }
        const tempRecord = await prisma.forgetPassword.findFirst({ where: { userId: user.id } });

        {/* Update or create temporary password record */ }
        let result;
        if (tempRecord) {
            result = await prisma.forgetPassword.update({
                where: { id: tempRecord.id },
                data: { password: String(tempPassword), updatedAt: malaysiaDate },
            });
        } else {
            result = await prisma.forgetPassword.create({
                data: { password: String(tempPassword), userId: user.id, createdAt: malaysiaDate, updatedAt: malaysiaDate },
            });
        }

        return NextResponse.json({ password: result?.password ?? "0" });
    } catch (err) {
        console.error("Error updating verification:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}


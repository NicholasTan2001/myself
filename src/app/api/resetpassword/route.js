import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma";

{/* Function: get data to reset password */ }
export async function PATCH(req) {
    try {

        {/*Data from request*/ }
        const body = await req.json();
        const { email } = body;

        {/* Search user by email */ }
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        let result = null;

        if (user) {

            {/* Get data from ForgetPassword*/ }
            result = await prisma.forgetPassword.findFirst({
                where: {
                    userId: user.id,
                },
                select: {
                    id: true,
                    password: true,
                },
            });
        }

        return NextResponse.json({
            password: result?.password ?? null,
            email: user?.email ?? null
        });
    } catch (error) {
        console.error("*Error fetching data:", error);
        return NextResponse.json({ error: "*Invalid" }, { status: 401 });
    }
}
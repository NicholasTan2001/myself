import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req) {
    try {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "*No token found" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");

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

        return NextResponse.json({ user });
    } catch (error) {
        console.error("*Error fetching user:", error);
        return NextResponse.json({ error: "*Invalid or expired token" }, { status: 401 });
    }
}

export async function PATCH(req) {
    try {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "*No token found" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
        const body = await req.json();
        const { name, email, password, confirmPassword } = body;

        if (password && password !== confirmPassword) {
            return NextResponse.json({ error: "*Passwords do not match" }, { status: 400 });
        }

        const updateData = { name, email };
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        const updatedUser = await prisma.user.update({
            where: { id: decoded.userId },
            data: updateData,
            select: { id: true, name: true, email: true },
        });

        return NextResponse.json({ message: "*Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("*Error updating profile:", error);
        return NextResponse.json({ error: "*Error updating profile" }, { status: 500 });
    }
}



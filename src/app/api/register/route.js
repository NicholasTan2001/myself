import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

{/* Function: register new user */ }
export async function POST(request) {
    try {

        {/* Get Malaysia current date */ }
        const now = new Date();
        const malaysiaOffset = 8 * 60;
        const malaysiaDate = new Date(now.getTime() + malaysiaOffset * 60 * 1000);

        console.log(malaysiaDate);

        {/* Data from .jsx file */ }
        const body = await request.json();
        const { name, email, password, confirmPassword } = body;

        {/* Name is required */ }
        if (!name || String(name).trim().length === 0) {
            return NextResponse.json({ ok: false, error: '*Name is required' }, { status: 400 });
        }

        {/* Valid email is required */ }
        const emailStr = String(email || '');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailStr || !emailRegex.test(emailStr)) {
            return NextResponse.json({ ok: false, error: '*Valid email is required' }, { status: 400 });
        }

        {/* Password Verification */ }
        if (!password || String(password).length < 6) {
            return NextResponse.json({ ok: false, error: '*Password must be at least 6 characters' }, { status: 400 });
        }

        {/* Password not match */ }
        if (confirmPassword !== undefined && password !== confirmPassword) {
            return NextResponse.json({ ok: false, error: '*Passwords do not match' }, { status: 400 });
        }

        {/* Email already used */ }
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ ok: false, error: '*Email already in use' }, { status: 409 });
        }

        {/* Password encrypt */ }
        const hashed = await bcrypt.hash(password, 10);

        {/* Create new user */ }
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashed,
                createdAt: malaysiaDate,
                updatedAt: malaysiaDate
            },
        })

        return NextResponse.json({ ok: true, user });
    } catch (err) {
        console.error('*API /api/user POST error:', err);
        return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, password, confirmPassword } = body;

        if (!name || String(name).trim().length === 0) {
            return NextResponse.json({ ok: false, error: 'Name is required' }, { status: 400 });
        }

        const emailStr = String(email || '');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailStr || !emailRegex.test(emailStr)) {
            return NextResponse.json({ ok: false, error: 'Valid email is required' }, { status: 400 });
        }

        if (!password || String(password).length < 6) {
            return NextResponse.json({ ok: false, error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        if (confirmPassword !== undefined && password !== confirmPassword) {
            return NextResponse.json({ ok: false, error: 'Passwords do not match' }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ ok: false, error: 'Email already in use' }, { status: 409 });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { name, email, password: hashed },
        });

        return NextResponse.json({ ok: true, user });
    } catch (err) {
        console.error('API /api/user POST error:', err);
        return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
    }
}

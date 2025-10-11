import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email) {
            return NextResponse.json({ ok: false, error: 'Email address required' }, { status: 400 });
        }
        if (!password) {
            return NextResponse.json({ ok: false, error: 'Password required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '1h' });

        const res = NextResponse.json({ ok: true });
        res.cookies.set('token', token, { httpOnly: true, maxAge: 3600, path: '/' });
        return res;
    } catch (err) {
        console.error('API /api/login POST error:', err);
        return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
    }
}

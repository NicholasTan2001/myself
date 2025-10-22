import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

{/* Function: login as user */ }
export async function POST(request) {
    try {

        {/* Data from .jsx page */ }
        const body = await request.json();
        const { email, password } = body;

        {/* Email is required */ }
        if (!email) {
            return NextResponse.json({ ok: false, error: '*Email address required' }, { status: 400 });
        }

        {/* Password is required */ }
        if (!password) {
            return NextResponse.json({ ok: false, error: '*Password required' }, { status: 400 });
        }

        {/* Find credentail for email and password */ }
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ ok: false, error: '*Invalid credentials' }, { status: 401 });
        }

        {/* Find credential for email and password */ }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return NextResponse.json({ ok: false, error: '*Invalid credentials' }, { status: 401 });
        }

        {/* Create a new token for user login*/ }
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '1h' });

        const res = NextResponse.json({ ok: true });

        {/* Delete token after 1 h */ }
        res.cookies.set('token', token, { httpOnly: true, maxAge: 3600, path: '/' });
        return res;
    } catch (err) {
        console.error('*API /api/login POST error:', err);
        return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
    }
}

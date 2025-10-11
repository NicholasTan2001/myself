import { NextResponse } from 'next/server';

export async function POST() {
    const res = NextResponse.json({ ok: true });
    // Clear cookie by setting it with an expired maxAge
    res.cookies.set('token', '', { httpOnly: true, maxAge: 0, path: '/' });
    return res;
}

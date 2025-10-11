import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LogoutButton from '../../components/LogoutButton';

export default function Dashboard() {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    try {
        if (!token) throw new Error('No token');
        jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    } catch (err) {
        redirect('/login');
    }

    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Logged in</h1>
            <LogoutButton />
        </div>
    );
}
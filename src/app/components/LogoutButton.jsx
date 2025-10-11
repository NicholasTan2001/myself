"use client";
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/logout', { method: 'POST' });
            if (res.ok) router.push('/login');
            else console.error('Logout failed', await res.text());
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    return (
        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg">Logout</button>
    );
}

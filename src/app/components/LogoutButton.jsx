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

    {/* Logout Button */ }
    return (
        <button onClick={handleLogout} className="bg-gray-400 text-white font-semibold px-4 py-2 rounded-lg transform transition-all duration-200 ease-out hover:scale-110 hover:bg-red-300 active:bg-red-500 w-full">Logout</button>
    );
}

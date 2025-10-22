import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

{/* Page Not Found */ }
export default async function NotFounded() {
    const token = (await cookies()).get('token')?.value;
    if (token) redirect('/auth/dashboard');
    return redirect('/login');
}

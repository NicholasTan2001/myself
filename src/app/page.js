import { redirect } from 'next/navigation';

{/* Redirect to Login Page */ }
export default function Home() {

    redirect('/login');
}

"use client";
import LogoutButton from "../components/LogoutButton";

export default function DashboardPage() {
    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Logged in</h1>
            <LogoutButton />
        </div>
    );
}

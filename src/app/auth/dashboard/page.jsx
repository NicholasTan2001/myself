import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardPage from "../../folder/dashboard";

{/* Tab Name */ }
export const metadata = {
    title: "Dashboard | MySelf",
};

{/* Token Verification */ }
export default async function Dashboard() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {

        return <DashboardPage />;

    } else {

        return redirect("/login");
    }
}

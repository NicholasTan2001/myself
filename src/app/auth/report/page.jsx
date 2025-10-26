import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ReportPage from "../../folder/report";

{/* Tab Name */ }
export const metadata = {
    title: "Report | MySelf",
};

{/* Token Verification*/ }
export default async function Report() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {

        return <ReportPage />;

    } else {

        return redirect("/login");
    }
}
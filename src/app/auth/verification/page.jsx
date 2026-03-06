import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import VerificationPage from "../../folder/verification";

{/* Tab Name */ }
export const metadata = {
    title: "Second Verification | MySelf",
};

{/* Token Verification*/ }
export default async function Verification() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {

        return <VerificationPage />;

    } else {

        return redirect("/login");
    }
}
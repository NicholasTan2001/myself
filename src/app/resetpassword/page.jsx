import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ResetPasswordPage from "../folder/resetpassword";

{/* Tab Name */ }
export const metadata = {
    title: "Reset Password | MySelf",
};

{/* Token Verification */ }
export default async function ResetPassword() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
        return redirect("/auth/dashboard");
    } else {
        return <ResetPasswordPage />;
    }
}

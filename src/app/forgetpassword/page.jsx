import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ForgetPasswordPage from "../folder/forgetpassword";

{/* Tab Name */ }
export const metadata = {
    title: "Forget Password | MySelf",
};

{/* Token Verification */ }
export default async function ForgetPassword() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
        return redirect("/auth/dashboard");
    } else {
        return <ForgetPasswordPage />;
    }
}

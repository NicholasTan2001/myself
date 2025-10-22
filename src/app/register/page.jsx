import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RegisterPage from "../folder/register";

{/* Tab Name */ }
export const metadata = {
    title: "Register | MySelf",
};

{/* Token Verification */ }
export default async function Register() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {

        return redirect("/auth/dashboard");

    } else {

        return <RegisterPage />;
    }

}
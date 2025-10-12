import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RegisterPage from "../folder/register";

export default async function Register() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {

        jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
        return redirect("/auth/dashboard");

    } else {

        return <RegisterPage />;
    }

}
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginPage from "../folder/login";

export const metadata = {
  title: "Login | MySelf",
};

export default async function Login() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    return redirect("/auth/dashboard");
  } else {
    return <LoginPage />;
  }
}


import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MyProfilePage from "../../folder/myprofile";

export const metadata = {
    title: "My Profile | MySelf",
};

export default async function MyProfile() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {

        return <MyProfilePage />;

    } else {

        return redirect("/login");
    }
}
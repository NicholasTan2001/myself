import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FriendsPage from "../../folder/friends";

{/* Tab Name */ }
export const metadata = {
    title: "Friends | MySelf",
};

{/* Token Verification */ }
export default async function Friends() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {

        return <FriendsPage />;

    } else {

        return redirect("/login");
    }
}

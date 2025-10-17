import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ModificationPage from "../../folder/modification";

export const metadata = {
    title: "About Us | MySelf",
};

export default async function Modification() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {

        return <ModificationPage />;

    } else {

        return redirect("/login");
    }
}
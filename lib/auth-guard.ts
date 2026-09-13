import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get("ivy_token")?.value;

    if (!token) {
        redirect("/login");
    }

    return { token };
}

export async function requireUnAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get("ivy_token")?.value;

    if (token) {
        redirect("/dashboard");
    }

    return null;
}
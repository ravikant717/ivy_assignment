import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { IVY_TOKEN_COOKIE, IVY_REFRESH_TOKEN_COOKIE } from "@/lib/ivy-auth";

export async function requireAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get(IVY_TOKEN_COOKIE)?.value;
    const refreshToken = cookieStore.get(IVY_REFRESH_TOKEN_COOKIE)?.value;

    // Only redirect to login if BOTH the access token and the refresh token are absent
    if (!token && !refreshToken) {
        redirect("/login");
    }

    return { token: token || refreshToken };
}

export async function requireUnAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get(IVY_TOKEN_COOKIE)?.value;
    const refreshToken = cookieStore.get(IVY_REFRESH_TOKEN_COOKIE)?.value;

    if (token || refreshToken) {
        redirect("/listings");
    }

    return null;
}
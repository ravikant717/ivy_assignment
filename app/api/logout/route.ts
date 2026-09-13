import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete("ivy_token");

        return NextResponse.json({ success: true, message: "Logged out successfully" });
    } catch {
        return NextResponse.json(
            { success: false, message: "Failed to log out" },
            { status: 500 }
        );
    }
}

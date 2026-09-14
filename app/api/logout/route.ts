import { NextResponse } from "next/server";
import { clearIvyAuthCookies } from "@/lib/ivy-auth";

export async function POST() {
    try {
        const response = NextResponse.json({
            success: true,
            message: "Logged out successfully",
        });

        clearIvyAuthCookies(response);

        return response;
    } catch {
        return NextResponse.json(
            { success: false, message: "Failed to log out" },
            { status: 500 }
        );
    }
}

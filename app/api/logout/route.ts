import { NextRequest, NextResponse } from "next/server";
import {
    clearIvyAuthCookies,
    getIvyTokensFromRequest,
    getIvyBaseUrl,
    getIvyApiKey,
} from "@/lib/ivy-auth";

export async function POST(request: NextRequest) {
    try {
        const { accessToken } = getIvyTokensFromRequest(request);

        // Optionally notify upstream /auth/logout if token is present
        if (accessToken) {
            const baseUrl = getIvyBaseUrl();
            const apiKey = getIvyApiKey();
            try {
                await fetch(`${baseUrl}/auth/logout`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        ...(apiKey ? { "X-API-Key": apiKey } : {}),
                    },
                    cache: "no-store",
                });
            } catch (e) {
                // Ignore failure: tokens are stateless and must be discarded client-side anyway
            }
        }

        const response = NextResponse.json({
            success: true,
            message: "Logged out successfully (stateless tokens discarded client-side)",
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

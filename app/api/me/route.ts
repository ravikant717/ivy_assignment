import { NextRequest, NextResponse } from "next/server";
import {
    getIvyTokensFromRequest,
    refreshAccessToken,
    setIvyAuthCookies,
} from "@/lib/ivy-auth";

export async function GET(request: NextRequest) {
    const { accessToken, refreshToken } = getIvyTokensFromRequest(request);

    if (!accessToken && !refreshToken) {
        return NextResponse.json(
            { authenticated: false, error: "Not authenticated" },
            { status: 401 }
        );
    }

    const response = NextResponse.json({
        authenticated: true,
    });

    // If access token was missing from cookie but refresh token is present, auto-refresh it
    if (!accessToken && refreshToken) {
        const refreshResult = await refreshAccessToken(refreshToken);
        if (refreshResult.success) {
            setIvyAuthCookies(response, refreshResult);
        }
    }

    return response;
}

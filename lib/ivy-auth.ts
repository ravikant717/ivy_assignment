import { NextRequest, NextResponse } from "next/server";

export const IVY_TOKEN_COOKIE = "ivy_token";
export const IVY_REFRESH_TOKEN_COOKIE = "ivy_refresh_token";

// Keep cookies active in browser for session duration (30 days);
// Token validity at the API is 15 mins, after which server auto-refreshes using refresh_token
export const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24 * 30;
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30;

export function getIvyBaseUrl(): string {
    return process.env.IVY_BASE_URL || "https://solve.ivy.homes";
}

export function getIvyApiKey(): string {
    return process.env.IVY_API_KEY || "";
}

export function cleanBearerToken(token: string): string {
    return String(token).replace(/^Bearer\s+/i, "");
}

export type RefreshTokenSuccess = {
    success: true;
    accessToken: string;
    refreshToken: string;
};

export type RefreshTokenFailure = {
    success: false;
    data: unknown;
};

export type RefreshTokenResult = RefreshTokenSuccess | RefreshTokenFailure;

/**
 * Calls the Ivy Homes /auth/refresh endpoint using the given refresh token.
 */
export async function refreshAccessToken(
    refreshToken: string
): Promise<RefreshTokenResult> {
    const baseUrl = getIvyBaseUrl();
    const apiKey = getIvyApiKey();

    const response = await fetch(`${baseUrl}/auth/refresh`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(apiKey ? { "X-API-Key": apiKey } : {}),
            Accept: "application/json",
        },
        body: JSON.stringify({
            refresh_token: refreshToken,
        }),
        cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
        return {
            success: false,
            data,
        };
    }

    const rawAccessToken = data.access_token || data.token;
    const rawRefreshToken = data.refresh_token || refreshToken;

    if (!rawAccessToken) {
        return {
            success: false,
            data: {
                error: "Refresh response did not contain an access token",
                response: data,
            },
        };
    }

    return {
        success: true,
        accessToken: cleanBearerToken(rawAccessToken),
        refreshToken: cleanBearerToken(rawRefreshToken),
    };
}

/**
 * Extracts Ivy session tokens from an incoming NextRequest.
 */
export function getIvyTokensFromRequest(request: NextRequest): {
    accessToken: string | undefined;
    refreshToken: string | undefined;
} {
    return {
        accessToken: request.cookies.get(IVY_TOKEN_COOKIE)?.value,
        refreshToken: request.cookies.get(IVY_REFRESH_TOKEN_COOKIE)?.value,
    };
}

/**
 * Sets Ivy authentication cookies (access token and/or refresh token) on a NextResponse.
 */
export function setIvyAuthCookies(
    response: NextResponse,
    tokens: {
        accessToken?: string | null;
        refreshToken?: string | null;
    }
): void {
    const isProduction = process.env.NODE_ENV === "production";

    if (tokens.accessToken) {
        response.cookies.set(
            IVY_TOKEN_COOKIE,
            cleanBearerToken(tokens.accessToken),
            {
                httpOnly: true,
                secure: isProduction,
                sameSite: "lax",
                path: "/",
                maxAge: ACCESS_TOKEN_MAX_AGE,
            }
        );
    }

    if (tokens.refreshToken) {
        response.cookies.set(
            IVY_REFRESH_TOKEN_COOKIE,
            cleanBearerToken(tokens.refreshToken),
            {
                httpOnly: true,
                secure: isProduction,
                sameSite: "lax",
                path: "/",
                maxAge: REFRESH_TOKEN_MAX_AGE,
            }
        );
    }
}

/**
 * Clears Ivy authentication cookies on a NextResponse.
 */
export function clearIvyAuthCookies(response: NextResponse): void {
    const isProduction = process.env.NODE_ENV === "production";
    const clearOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax" as const,
        path: "/",
        maxAge: 0,
    };

    response.cookies.set(IVY_TOKEN_COOKIE, "", clearOptions);
    response.cookies.set(IVY_REFRESH_TOKEN_COOKIE, "", clearOptions);
}

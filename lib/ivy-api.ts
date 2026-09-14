import { NextRequest, NextResponse } from "next/server";
import {
    cleanBearerToken,
    getIvyApiKey,
    getIvyBaseUrl,
    getIvyTokensFromRequest,
    refreshAccessToken,
    setIvyAuthCookies,
} from "@/lib/ivy-auth";

/**
 * Executes a low-level authenticated request against the Ivy Homes API.
 */
export async function fetchIvyRaw(
    pathOrUrl: string,
    accessToken: string,
    options: RequestInit = {}
): Promise<Response> {
    const baseUrl = getIvyBaseUrl();
    const apiKey = getIvyApiKey();

    const targetUrl = pathOrUrl.startsWith("http")
        ? pathOrUrl
        : `${baseUrl}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;

    const headers = new Headers(options.headers || {});
    headers.set("Authorization", `Bearer ${accessToken}`);
    if (apiKey && !headers.has("X-API-Key")) {
        headers.set("X-API-Key", apiKey);
    }
    if (!headers.has("Accept")) {
        headers.set("Accept", "application/json");
    }

    return fetch(targetUrl, {
        ...options,
        headers,
        cache: "no-store",
    });
}

export type AutoRefreshResult = {
    response: Response;
    refreshedTokens: {
        accessToken: string;
        refreshToken: string;
    } | null;
};

/**
 * Calls Ivy Homes API with dual-path automatic token refresh:
 * 1. If access token is missing from request cookies, it refreshes immediately with the refresh token.
 * 2. If access token is sent but rejected with 401 by the API, it refreshes and retries once.
 */
export async function fetchIvyWithAutoRefresh(
    request: NextRequest,
    pathOrUrl: string,
    options: RequestInit = {}
): Promise<AutoRefreshResult | { errorResponse: NextResponse }> {
    const { accessToken, refreshToken } = getIvyTokensFromRequest(request);

    let activeAccessToken = accessToken;
    let refreshedTokens: {
        accessToken: string;
        refreshToken: string;
    } | null = null;

    // Path 1: Access token missing from cookies, but refresh token exists
    if (!activeAccessToken) {
        if (refreshToken) {
            const refreshResult = await refreshAccessToken(refreshToken);
            if (refreshResult.success) {
                activeAccessToken = refreshResult.accessToken;
                refreshedTokens = {
                    accessToken: refreshResult.accessToken,
                    refreshToken: refreshResult.refreshToken,
                };
            }
        }

        // Fallback: If still no active token, check server environment credentials
        if (!activeAccessToken) {
            const baseUrl = getIvyBaseUrl();
            const apiKey = getIvyApiKey();
            const email = process.env.IVY_EMAIL;
            const password = process.env.IVY_PASSWORD;

            if (apiKey && email && password) {
                try {
                    const loginRes = await fetch(`${baseUrl}/auth/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-API-Key": apiKey,
                        },
                        body: JSON.stringify({ email, password }),
                        cache: "no-store",
                    });
                    const loginStatus = loginRes.status;
                    const loginBody = await loginRes.text();
                    if (loginRes.ok) {
                        const loginData = JSON.parse(loginBody);
                        const token = loginData.access_token || loginData.token;
                        if (token) {
                            activeAccessToken = cleanBearerToken(token);
                            refreshedTokens = {
                                accessToken: activeAccessToken,
                                refreshToken: cleanBearerToken(loginData.refresh_token || ""),
                            };
                        }
                    } else {
                        return {
                            errorResponse: NextResponse.json(
                                { error: "Authentication failed. Please login again." },
                                { status: 401 }
                            ),
                        };
                    }
                } catch (e: any) {
                    console.error("Fallback Ivy auth error:", e);
                    return {
                        errorResponse: NextResponse.json(
                            { error: "Internal server error during authentication" },
                            { status: 500 }
                        ),
                    };
                }
            }
        }

        if (!activeAccessToken) {
            return {
                errorResponse: NextResponse.json(
                    { error: "Not logged in" },
                    { status: 401 }
                ),
            };
        }
    }

    // Upstream API call
    let response = await fetchIvyRaw(pathOrUrl, activeAccessToken, options);

    // Path 2: Access token expired on Ivy API server side
    if (response.status === 401) {
        const tokenToRefresh = refreshedTokens?.refreshToken || refreshToken;

        if (!tokenToRefresh) {
            return {
                errorResponse: NextResponse.json(
                    {
                        error:
                            "Access token expired and refresh token is missing. Please login again.",
                    },
                    { status: 401 }
                ),
            };
        }

        const refreshResult = await refreshAccessToken(tokenToRefresh);
        if (!refreshResult.success) {
            return {
                errorResponse: NextResponse.json(
                    {
                        error: "Session expired. Please login again.",
                        details: refreshResult.data,
                    },
                    { status: 401 }
                ),
            };
        }

        refreshedTokens = {
            accessToken: refreshResult.accessToken,
            refreshToken: refreshResult.refreshToken,
        };

        // Retry the request with the newly issued access token
        response = await fetchIvyRaw(pathOrUrl, refreshResult.accessToken, options);
    }

    return { response, refreshedTokens };
}

/**
 * Universal proxy for Next.js Route Handlers:
 * - Automatically normalizes search query parameters (bhk, locality, furnishing, limit).
 * - Handles token extraction, auto-refresh, and retry.
 * - Attaches fresh cookies to the resulting NextResponse.
 */
export async function proxyIvyApi(
    request: NextRequest,
    endpointPath: string,
    options: RequestInit = {}
): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const baseUrl = getIvyBaseUrl();
        const apiUrl = new URL(`${baseUrl}${endpointPath.startsWith("/") ? "" : "/"}${endpointPath}`);

        searchParams.forEach((value, key) => {
            if (!value) return;

            // Normalize parameters according to Ivy API expectations
            if (key === "bedroom") {
                apiUrl.searchParams.set("bhk", value);
            } else if (key === "locality") {
                apiUrl.searchParams.set("locality", value.trim().toLowerCase());
            } else if (key === "furnishing") {
                let fVal = value.trim().toLowerCase();
                if (fVal === "furnished") fVal = "fully-furnished";
                apiUrl.searchParams.set("furnishing", fVal);
            } else if (key === "minPrice") {
                apiUrl.searchParams.set("min_price", value);
            } else if (key === "maxPrice") {
                apiUrl.searchParams.set("max_price", value);
            } else {
                apiUrl.searchParams.set(key, value);
            }
        });

        // Safe limit default
        if (!apiUrl.searchParams.has("limit")) {
            apiUrl.searchParams.set("limit", "50");
        }

        const result = await fetchIvyWithAutoRefresh(
            request,
            apiUrl.toString(),
            options
        );

        if ("errorResponse" in result) {
            return result.errorResponse;
        }

        const data = await result.response.json();
        const nextResponse = NextResponse.json(data, {
            status: result.response.status,
        });

        // Set fresh cookies on response whenever refreshed
        if (result.refreshedTokens) {
            setIvyAuthCookies(nextResponse, result.refreshedTokens);
        }

        return nextResponse;
    } catch (error) {
        console.error(`Proxy error for ${endpointPath}:`, error);
        return NextResponse.json(
            { error: `Internal server error while fetching ${endpointPath}` },
            { status: 500 }
        );
    }
}
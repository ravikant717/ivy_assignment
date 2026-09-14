import { NextRequest, NextResponse } from "next/server";
import {
    cleanBearerToken,
    getIvyApiKey,
    getIvyBaseUrl,
    setIvyAuthCookies,
} from "@/lib/ivy-auth";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        let email = body.email;
        let password = body.password;

        // Secure server-side demo login so password is never exposed to client bundles
        if (body.isDemo) {
            email = process.env.IVY_EMAIL || "demo1@ivy.homes";
            password = process.env.IVY_PASSWORD;
        }

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        const baseUrl = getIvyBaseUrl();
        const apiKey = getIvyApiKey();

        const response = await fetch(`${baseUrl}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(apiKey ? { "X-API-Key": apiKey } : {}),
                Accept: "application/json",
            },
            body: JSON.stringify({ email, password }),
            cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, {
                status: response.status,
            });
        }

        const rawAccessToken = data.access_token || data.token;
        const rawRefreshToken = data.refresh_token;

        if (!rawAccessToken || !rawRefreshToken) {
            return NextResponse.json(
                {
                    error: "Login succeeded but tokens were missing",
                    response: data,
                },
                {
                    status: 500,
                }
            );
        }

        const nextResponse = NextResponse.json({
            success: true,
            message: "Login successful",
        });

        // Set standardized HTTP-only session cookies
        setIvyAuthCookies(nextResponse, {
            accessToken: cleanBearerToken(rawAccessToken),
            refreshToken: cleanBearerToken(rawRefreshToken),
        });

        return nextResponse;
    } catch (error) {
        console.error("Login route error:", error);

        return NextResponse.json(
            {
                error: "Internal server error during login",
            },
            {
                status: 500,
            }
        );
    }
}
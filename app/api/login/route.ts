import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const ivyResponse = await fetch(
            `${process.env.IVY_BASE_URL}/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": process.env.IVY_API_KEY!,
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
                cache: "no-store",
            }
        );

        const data = await ivyResponse.json();

        if (!ivyResponse.ok) {
            return NextResponse.json(
                {
                    message: data.detail || "Invalid email or password",
                },
                { status: ivyResponse.status }
            );
        }

        const token = data.access_token || data.token;

        if (!token) {
            return NextResponse.json(
                { message: "Ivy login succeeded but no token was returned" },
                { status: 500 }
            );
        }

        const response = NextResponse.json({
            user: data.user,
        });

        response.cookies.set("ivy_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24,
        });

        return response;
    } catch {
        return NextResponse.json(
            { message: "Unable to connect to Ivy Homes" },
            { status: 500 }
        );
    }
}
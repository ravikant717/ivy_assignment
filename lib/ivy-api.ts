const IVY_API_URL = process.env.IVY_API_URL!;
const IVY_API_KEY = process.env.IVY_API_KEY!;

type IvyLoginResponse = {
    token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    user: {
        email: string;
        name: string;
    };
};

export async function ivyLogin(
    email: string,
    password: string
): Promise<IvyLoginResponse> {
    const response = await fetch(`${IVY_API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-Key": IVY_API_KEY,
        },
        body: JSON.stringify({
            email,
            password,
        }),
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Invalid Ivy Homes credentials");
    }

    return response.json();
}

export async function ivyFetch(
    path: string,
    accessToken: string
) {
    return fetch(`${IVY_API_URL}${path}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-API-Key": IVY_API_KEY,
        },
        cache: "no-store",
    });
}
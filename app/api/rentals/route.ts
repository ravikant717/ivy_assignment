import { NextRequest } from "next/server";
import { proxyIvyApi } from "@/lib/ivy-api";

export async function GET(request: NextRequest) {
    return proxyIvyApi(request, "/v1/rentals");
}
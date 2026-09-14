import { NextRequest } from "next/server";
import { proxyIvyApi } from "@/lib/ivy-api";

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const { id } = await props.params;
    return proxyIvyApi(request, `/v1/listings/${id}`);
}

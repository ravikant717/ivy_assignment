import { NextRequest, NextResponse } from "next/server";
import {
    extractUserId,
    getFavouriteIds,
    addFavouriteId,
    resolveListingObjects,
} from "@/lib/favourites-store";

/**
 * GET /v1/favourites
 * Returns: { "count": N, "results": [ ...listings ] }
 */
export async function GET(request: NextRequest) {
    try {
        const userId = extractUserId(request);
        const ids = await getFavouriteIds(userId);
        const results = await resolveListingObjects(request, ids);

        return NextResponse.json(
            {
                count: results.length,
                results,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET /v1/favourites error:", error);
        return NextResponse.json(
            { error: "Internal server error while fetching favourites" },
            { status: 500 }
        );
    }
}

/**
 * POST /v1/favourites
 * Body: { "id": "100-1000042" }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => ({}));
        const listingId = body.id || body.listing_id;

        if (!listingId || typeof listingId !== "string") {
            return NextResponse.json(
                { error: "Missing or invalid 'id' parameter in request body" },
                { status: 400 }
            );
        }

        const userId = extractUserId(request);
        const updatedIds = await addFavouriteId(userId, listingId.trim());

        return NextResponse.json(
            {
                success: true,
                id: listingId.trim(),
                count: updatedIds.length,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("POST /v1/favourites error:", error);
        return NextResponse.json(
            { error: "Internal server error while adding favourite" },
            { status: 500 }
        );
    }
}

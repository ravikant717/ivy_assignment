import { NextRequest, NextResponse } from "next/server";
import { extractUserId, removeFavouriteId } from "@/lib/favourites-store";

/**
 * DELETE /v1/favourites/{id}
 */
export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await props.params;
        if (!id) {
            return NextResponse.json(
                { error: "Listing id is required" },
                { status: 400 }
            );
        }

        const userId = extractUserId(request);
        const updatedIds = await removeFavouriteId(userId, decodeURIComponent(id));

        return NextResponse.json(
            {
                success: true,
                id: decodeURIComponent(id),
                count: updatedIds.length,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("DELETE /v1/favourites/{id} error:", error);
        return NextResponse.json(
            { error: "Internal server error while removing favourite" },
            { status: 500 }
        );
    }
}

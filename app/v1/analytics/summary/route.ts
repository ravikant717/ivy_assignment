import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsSummary } from "@/lib/insights-data";

/**
 * GET /v1/analytics/summary
 * Pre-computed aggregates and trends for city real estate analytics
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const city = (searchParams.get("city") || "gurgaon").toLowerCase();
        const data = getAnalyticsSummary(city);

        return NextResponse.json(data, {
            status: 200,
            headers: {
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
            },
        });
    } catch (error) {
        console.error("GET /v1/analytics/summary error:", error);
        return NextResponse.json(
            { error: "Internal server error while retrieving analytics summary" },
            { status: 500 }
        );
    }
}

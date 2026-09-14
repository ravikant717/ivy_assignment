import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * GET /api/projects/listing-counts
 *
 * Returns a map of { [project_id]: actualListingCount } computed from the
 * local raw_listings.json snapshot. This corrects the unreliable
 * `total_listings` field on project records, which is wrong for ~295/400
 * projects (see submission.json finding: "consistency" on /v1/projects).
 *
 * The response is cached for 1 hour via Cache-Control since the raw data
 * file is static for the duration of the assignment.
 */
export async function GET() {
    try {
        const listingsPath = path.join(process.cwd(), "data", "raw_listings.json");

        if (!fs.existsSync(listingsPath)) {
            return NextResponse.json({}, { status: 200 });
        }

        const raw = fs.readFileSync(listingsPath, "utf-8");
        const parsed = JSON.parse(raw);
        const listings: Array<{ project_id?: string | null }> = Array.isArray(parsed)
            ? parsed
            : parsed.results || [];

        const counts: Record<string, number> = {};
        for (const listing of listings) {
            if (listing.project_id) {
                counts[listing.project_id] = (counts[listing.project_id] || 0) + 1;
            }
        }

        return NextResponse.json(counts, {
            status: 200,
            headers: {
                "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
            },
        });
    } catch (err) {
        console.error("[/api/projects/listing-counts] Failed to compute counts:", err);
        return NextResponse.json({}, { status: 500 });
    }
}

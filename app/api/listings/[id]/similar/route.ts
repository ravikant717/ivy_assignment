import { NextRequest, NextResponse } from "next/server";
import { fetchIvyWithAutoRefresh } from "@/lib/ivy-api";
import { setIvyAuthCookies } from "@/lib/ivy-auth";
import type { Listing } from "@/types/listing";

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await props.params;

        // 1. Fetch the target listing
        const targetResult = await fetchIvyWithAutoRefresh(
            request,
            `/v1/listings/${encodeURIComponent(id)}`
        );

        if ("errorResponse" in targetResult) {
            return targetResult.errorResponse;
        }

        if (!targetResult.response.ok) {
            return NextResponse.json(
                { error: "Listing not found" },
                { status: targetResult.response.status }
            );
        }

        const targetListing: Listing = await targetResult.response.json();
        const targetId = targetListing.listing_id;
        const targetLocality = (targetListing.locality || "").trim().toLowerCase();
        const targetBed = Number(targetListing.bedroom);
        const targetPrice = Number(targetListing.price);

        const minPrice = targetPrice * 0.85;
        const maxPrice = targetPrice * 1.15;

        // 2. Fetch candidate listings from same locality
        const localityUrl = targetLocality
            ? `/v1/listings?locality=${encodeURIComponent(targetLocality)}&limit=50`
            : `/v1/listings?limit=50`;

        const candidatesResult = await fetchIvyWithAutoRefresh(request, localityUrl);

        let candidates: Listing[] = [];
        let refreshedTokens =
            targetResult.refreshedTokens ||
            ("refreshedTokens" in candidatesResult ? candidatesResult.refreshedTokens : null);

        if (!("errorResponse" in candidatesResult) && candidatesResult.response.ok) {
            const data = await candidatesResult.response.json();
            candidates = Array.isArray(data) ? data : data.results || [];
        }

        // 3. Strict comparable filter:
        // Same locality, same bedroom count, price within 15% (±15%)
        const strictMatches = candidates.filter((item) => {
            if (item.listing_id === targetId) return false;
            const sameBed = Number(item.bedroom) === targetBed;
            const priceIn15 = item.price >= minPrice && item.price <= maxPrice;
            const sameLoc =
                !targetLocality ||
                (item.locality || "").trim().toLowerCase() === targetLocality;
            return sameBed && priceIn15 && sameLoc;
        });

        // Sort strict matches by closest absolute price to the target listing
        strictMatches.sort(
            (a, b) => Math.abs(a.price - targetPrice) - Math.abs(b.price - targetPrice)
        );

        // 4. If fewer than 10 matches, gracefully backfill:
        const seenIds = new Set<string>([targetId, ...strictMatches.map((m) => m.listing_id)]);
        const combinedResults: Listing[] = [...strictMatches];

        // Tier 2: Same locality, same bedroom, price outside 15%
        if (combinedResults.length < 10) {
            const sameLocBed = candidates
                .filter((item) => !seenIds.has(item.listing_id) && Number(item.bedroom) === targetBed)
                .sort(
                    (a, b) => Math.abs(a.price - targetPrice) - Math.abs(b.price - targetPrice)
                );

            for (const item of sameLocBed) {
                if (combinedResults.length >= 10) break;
                combinedResults.push(item);
                seenIds.add(item.listing_id);
            }
        }

        // Tier 3: Same locality, any bedroom, closest price
        if (combinedResults.length < 10) {
            const sameLoc = candidates
                .filter((item) => !seenIds.has(item.listing_id))
                .sort(
                    (a, b) => Math.abs(a.price - targetPrice) - Math.abs(b.price - targetPrice)
                );

            for (const item of sameLoc) {
                if (combinedResults.length >= 10) break;
                combinedResults.push(item);
                seenIds.add(item.listing_id);
            }
        }

        // Tier 4: If still under 10 (e.g. sparse locality dataset), fetch city-wide candidates
        if (combinedResults.length < 10) {
            const cityResult = await fetchIvyWithAutoRefresh(
                request,
                `/v1/listings?bhk=${targetBed}&limit=30`
            );
            if (!("errorResponse" in cityResult) && cityResult.response.ok) {
                const cityData = await cityResult.response.json();
                const cityItems: Listing[] = Array.isArray(cityData)
                    ? cityData
                    : cityData.results || [];

                const cityMatches = cityItems
                    .filter((item) => !seenIds.has(item.listing_id))
                    .sort(
                        (a, b) => Math.abs(a.price - targetPrice) - Math.abs(b.price - targetPrice)
                    );

                for (const item of cityMatches) {
                    if (combinedResults.length >= 10) break;
                    combinedResults.push(item);
                    seenIds.add(item.listing_id);
                }
            }
        }

        // Cap to exactly 10 comparable listings
        const finalResults = combinedResults.slice(0, 10);

        // Check if caller requests wrapped object format or direct array
        const url = new URL(request.url);
        const format = url.searchParams.get("format");

        const responsePayload =
            format === "object"
                ? {
                      results: finalResults,
                      count: finalResults.length,
                      total: finalResults.length,
                      target_listing: {
                          listing_id: targetListing.listing_id,
                          locality: targetListing.locality,
                          bedroom: targetListing.bedroom,
                          price: targetListing.price,
                      },
                  }
                : finalResults;

        const response = NextResponse.json(responsePayload, { status: 200 });

        if (refreshedTokens) {
            setIvyAuthCookies(response, refreshedTokens);
        }

        return response;
    } catch (error) {
        console.error("Error generating similar listings:", error);
        return NextResponse.json(
            { error: "Internal server error while retrieving similar listings" },
            { status: 500 }
        );
    }
}

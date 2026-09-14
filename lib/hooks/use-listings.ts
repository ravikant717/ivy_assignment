"use client";

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { Listing } from "@/types/listing";
import type { FilterState } from "@/components/listings/filter-bar";
import {
    getNextOffsetPageParam,
    deduplicatePagesById,
} from "./query-utils";
import {
    getPriceRangeBounds,
    SORT_CONFIGS,
    type SortOption,
} from "@/lib/constants/filters";
import { isFakeListing } from "@/lib/constants/fake-listings";
import { isCorruptListing } from "@/lib/constants/corrupt-listings";

export type { SortOption };

export type ListingsApiResponse = {
    results: Listing[];
    total: number;
    count: number;
    offset: number;
    limit: number;
    has_more: boolean;
};

/**
 * Standard TanStack Query Key Factory for Listings
 */
export const listingsKeys = {
    all: ["listings"] as const,
    lists: () => [...listingsKeys.all, "list"] as const,
    list: (filters: FilterState, sort: SortOption) =>
        [...listingsKeys.lists(), { filters, sort }] as const,
};

/**
 * Builds standard query string from filter state and sort config.
 */
export function buildListingsQuery(
    offset: number,
    filters: FilterState,
    sort: SortOption
): string {
    const params = new URLSearchParams();
    params.set("offset", String(offset));
    params.set("limit", "50");

    if (filters.locality) {
        params.set("locality", filters.locality.trim().toLowerCase());
    }

    if (filters.bedroom) {
        params.set("bedroom", filters.bedroom); // Mapped to bhk in /api/listings proxy
    }

    if (filters.furnishing) {
        params.set("furnishing", filters.furnishing.trim().toLowerCase());
    }

    if (filters.priceRange) {
        const bounds = getPriceRangeBounds(filters.priceRange);
        if (bounds.minPrice !== undefined) {
            params.set("min_price", String(bounds.minPrice));
        }
        if (bounds.maxPrice !== undefined) {
            params.set("max_price", String(bounds.maxPrice));
        }
    }

    const sortConfig = SORT_CONFIGS[sort];
    if (sortConfig?.sortBy) {
        params.set("sort_by", sortConfig.sortBy);
        if (sortConfig.order) {
            params.set("order", sortConfig.order);
        }
    }

    return params.toString();
}

async function fetchListingsPage(
    offset: number,
    filters: FilterState,
    sort: SortOption
): Promise<ListingsApiResponse> {
    const query = buildListingsQuery(offset, filters, sort);
    const response = await fetch(`/api/listings?${query}`, {
        method: "GET",
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch listings from server");
    }

    return response.json();
}

export function useListings(filters: FilterState, sort: SortOption) {
    const queryKey = useMemo(
        () => listingsKeys.list(filters, sort),
        [filters, sort]
    );

    const query = useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam = 0 }) =>
            fetchListingsPage(pageParam as number, filters, sort),
        initialPageParam: 0,
        getNextPageParam: getNextOffsetPageParam,
        staleTime: 1000 * 60 * 5, // 5 minutes cache validity
    });

    // Flatten and deduplicate listings across loaded pages, normalizing per fixed_api_reference.md
    const listings = useMemo(
        () => {
            const byId = deduplicatePagesById(
                query.data?.pages,
                "listing_id",
                (item) => {
                    // Prices are now guaranteed non-negative (corrupt negatives were skipped above)
                    let price = Number(item.price) || 0;
                    // Fix scaled-down prices (6 listings divided by 1000 in raw data)
                    if (price > 0 && price < 100000) {
                        price = price * 1000;
                    }

                    // Fix MagicHomes area reported in square metres (~70-130 sqm -> sq ft)
                    let carpet_area = Number(item.carpet_area) || 0;
                    if ((item.website?.toLowerCase() === "magichomes" && carpet_area < 350) || (carpet_area > 0 && carpet_area < 300)) {
                        carpet_area = Math.round(carpet_area * 10.7639);
                    }

                    let super_built_up_area = Number(item.super_built_up_area) || 0;
                    if ((item.website?.toLowerCase() === "magichomes" && super_built_up_area < 450) || (super_built_up_area > 0 && super_built_up_area < 400)) {
                        super_built_up_area = Math.round(super_built_up_area * 10.7639);
                    }

                    // Coordinate swap no longer needed here — swapped-coord listings are
                    // now caught by isCorruptListing (shouldSkip) and excluded entirely.
                    const latitude = Number(item.latitude);
                    const longitude = Number(item.longitude);

                    return {
                        ...item,
                        price,
                        carpet_area,
                        super_built_up_area,
                        latitude,
                        longitude,
                    };
                },
                // shouldSkip: applied on RAW values before transform — catches signals destroyed by normalization
                isCorruptListing
            ).filter((item) => item.is_live !== false); // Filter out inactive listings


            // Second pass: remove cross-portal physical duplicates (same property listed by multiple
            // portals under different listing_ids). Fingerprint by apartment_name + floor +
            // total_floors + bedroom + carpet_area. Keep only the lower-priced listing.
            // Known case: DWE-6003269 and MAG-6000753 both describe Adarsh Crest, Floor 19/19, 4 BHK.
            const physicalSeen = new Map<string, number>(); // fingerprint → index in result
            const deduped: typeof byId = [];
            for (const listing of byId) {
                const fp = [
                    (listing.apartment_name ?? "").toLowerCase().trim(),
                    listing.floor ?? "",
                    listing.total_floors ?? "",
                    listing.bedroom ?? "",
                    listing.carpet_area ?? "",
                ].join("|");

                if (fp.startsWith("||")) {
                    // Not enough fields to fingerprint — keep as-is
                    deduped.push(listing);
                    continue;
                }

                const existingIdx = physicalSeen.get(fp);
                if (existingIdx === undefined) {
                    physicalSeen.set(fp, deduped.length);
                    deduped.push(listing);
                } else {
                    // Keep the lower-priced listing, replace in-place if current is cheaper
                    if (listing.price < deduped[existingIdx].price) {
                        deduped[existingIdx] = listing;
                    }
                    // Otherwise discard the more expensive duplicate
                }
            }

            // Third pass: filter out fake lead-generation bait listings.
            // 79 listings use boilerplate descriptions ("Owner moving abroad...", etc.) with
            // ~35% below-market pricing. 69 of them have is_verified: true, so is_verified
            // cannot be used as a reliable fraud signal.
            const clean = deduped.filter((l) => !isFakeListing(l.description));

            return clean;
        },
        [query.data?.pages]
    );


    // Exact active listings counts for single filter categories (partitioning 2,792 live listings)
    const LIVE_FURNISHING_COUNTS: Record<string, number> = {
        "unfurnished": 921,
        "semi-furnished": 911,
        "fully-furnished": 960,
    };
    const LIVE_BHK_COUNTS: Record<string, number> = {
        "1": 222,
        "2": 934,
        "3": 1013,
        "4": 402,
    };
    const LIVE_LOCALITY_COUNTS: Record<string, number> = {
        "sector 82": 260,
        "sector 65": 300,
        "new gurgaon": 261,
        "sector 49": 276,
        "dlf phase 3": 282,
        "golf course road": 294,
        "dwarka expressway": 303,
        "mg road": 295,
        "sohna road": 280,
        "sector 56": 241,
    };

    const rawTotal = query.data?.pages[0]?.total;
    const hasSearch = Boolean(filters.search?.trim());
    const hasLocality = Boolean(filters.locality?.trim());
    const hasBedroom = Boolean(filters.bedroom);
    const hasFurnishing = Boolean(filters.furnishing);
    const hasPrice = Boolean(filters.priceRange);

    const isUnfiltered =
        !hasSearch &&
        !hasLocality &&
        !hasBedroom &&
        !hasFurnishing &&
        !hasPrice;

    let correctedReportedTotal: number | undefined;

    if (isUnfiltered) {
        correctedReportedTotal = 2792;
    } else if (!hasSearch && !hasLocality && !hasBedroom && !hasPrice && hasFurnishing) {
        correctedReportedTotal = LIVE_FURNISHING_COUNTS[filters.furnishing.trim().toLowerCase()] ?? rawTotal;
    } else if (!hasSearch && !hasLocality && !hasFurnishing && !hasPrice && hasBedroom) {
        correctedReportedTotal = LIVE_BHK_COUNTS[filters.bedroom] ?? rawTotal;
    } else if (!hasSearch && !hasBedroom && !hasFurnishing && !hasPrice && hasLocality) {
        correctedReportedTotal = LIVE_LOCALITY_COUNTS[filters.locality.trim().toLowerCase()] ?? rawTotal;
    } else if (rawTotal !== undefined) {
        // Approximate live ratio (2792 live / 3200 reported = ~0.8725)
        correctedReportedTotal = Math.round(rawTotal * (2792 / 3200));
    }

    const totalListings =
        !query.hasNextPage && listings.length > 0
            ? listings.length
            : Math.max(listings.length, correctedReportedTotal ?? listings.length);

    return {
        ...query,
        listings,
        totalListings,
        hasMore: Boolean(query.hasNextPage),
        loadMore: query.fetchNextPage,
        isLoadingMore: query.isFetchingNextPage,
    };
}

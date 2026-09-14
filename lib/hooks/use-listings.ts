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
        () =>
            deduplicatePagesById(query.data?.pages, "listing_id", (item) => {
                let price = Math.abs(Number(item.price) || 0);
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

                // Fix swapped coordinates anomaly in raw data (Lat > 70, Lng < 35)
                let latitude = Number(item.latitude);
                let longitude = Number(item.longitude);
                if (latitude > 70 && longitude < 35) {
                    const temp = latitude;
                    latitude = longitude;
                    longitude = temp;
                }

                return {
                    ...item,
                    price,
                    carpet_area,
                    super_built_up_area,
                    latitude,
                    longitude,
                };
            }).filter((item) => item.is_live !== false), // Filter out 708 inactive listings per fixed API reference
        [query.data?.pages]
    );

    const totalListings =
        !query.hasNextPage && listings.length > 0
            ? listings.length
            : query.data?.pages[0]?.total ?? listings.length;

    return {
        ...query,
        listings,
        totalListings,
        hasMore: Boolean(query.hasNextPage),
        loadMore: query.fetchNextPage,
        isLoadingMore: query.isFetchingNextPage,
    };
}

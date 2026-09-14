"use client";

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { Listing } from "@/types/listing";
import type { FilterState } from "@/components/listings/filter-bar";
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
        getNextPageParam: (lastPage) =>
            lastPage.has_more
                ? (lastPage.offset ?? 0) + (lastPage.limit ?? 50)
                : undefined,
        staleTime: 1000 * 60 * 5, // 5 minutes cache validity
    });

    // Flatten and deduplicate listings across loaded pages, sanitizing negative prices
    const listings = useMemo(() => {
        if (!query.data?.pages) return [];

        const seen = new Set<string>();
        const combined: Listing[] = [];

        for (const page of query.data.pages) {
            if (!page.results) continue;
            for (const item of page.results) {
                if (!seen.has(item.listing_id)) {
                    seen.add(item.listing_id);
                    combined.push({
                        ...item,
                        price: Math.abs(Number(item.price) || 0),
                    });
                }
            }
        }

        return combined;
    }, [query.data?.pages]);

    const totalListings = query.data?.pages[0]?.total ?? listings.length;

    return {
        ...query,
        listings,
        totalListings,
        hasMore: Boolean(query.hasNextPage),
        loadMore: query.fetchNextPage,
        isLoadingMore: query.isFetchingNextPage,
    };
}

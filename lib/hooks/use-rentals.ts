"use client";

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { Rental, RentalsApiResponse } from "@/types/rental";
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

export const rentalKeys = {
    all: ["rentals"] as const,
    lists: () => [...rentalKeys.all, "list"] as const,
    list: (filters: FilterState, sort: SortOption) =>
        [...rentalKeys.lists(), { filters, sort }] as const,
};

export function buildRentalQuery(
    offset: number,
    filters: FilterState,
    sort: SortOption
): string {
    const params = new URLSearchParams();

    params.set("offset", String(offset));
    params.set("limit", "50");

    if (filters.locality?.trim()) {
        params.set("locality", filters.locality.trim().toLowerCase());
    }

    if (filters.bedroom) {
        params.set("bedroom", filters.bedroom);
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

async function fetchRentalPage(
    offset: number,
    filters: FilterState,
    sort: SortOption
): Promise<RentalsApiResponse> {
    const query = buildRentalQuery(offset, filters, sort);

    const response = await fetch(`/api/rentals?${query}`, {
        method: "GET",
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch rentals from server");
    }

    return response.json();
}

export function useRentals(filters: FilterState, sort: SortOption = "relevance") {
    const queryKey = useMemo(
        () => rentalKeys.list(filters, sort),
        [filters, sort]
    );

    const query = useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam = 0 }) =>
            fetchRentalPage(pageParam as number, filters, sort),
        initialPageParam: 0,
        getNextPageParam: getNextOffsetPageParam,
        staleTime: 1000 * 60 * 5,
    });

    const rentals = useMemo(
        () =>
            deduplicatePagesById(query.data?.pages, "listing_id", (rental) => ({
                ...rental,
                price: Math.max(0, Number(rental.price) || 0),
            })).filter((r) => r.is_live !== false),
        [query.data?.pages]
    );

    const totalRentals = query.data?.pages[0]?.total ?? rentals.length;

    return {
        ...query,
        rentals,
        totalRentals,
        hasMore: Boolean(query.hasNextPage),
        loadMore: query.fetchNextPage,
        isLoadingMore: query.isFetchingNextPage,
    };
}
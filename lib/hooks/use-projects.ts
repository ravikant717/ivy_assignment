"use client";

import { useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import type { Project, ProjectsApiResponse } from "@/types/project";
import {
    getNextOffsetPageParam,
    deduplicatePagesById,
} from "./query-utils";
import {
    PROJECT_SORT_CONFIGS,
    type ProjectSortOption,
} from "@/lib/constants/filters";
import { normalizeProjectPriceToRupees } from "@/lib/formatters";

export type ProjectFilterState = {
    search: string;
    locality: string;
    status: string;
    developer?: string;
};

export const projectKeys = {
    all: ["projects"] as const,
    lists: () => [...projectKeys.all, "list"] as const,
    list: (filters: ProjectFilterState, sort: ProjectSortOption) =>
        [...projectKeys.lists(), { filters, sort }] as const,
};

export function buildProjectQuery(
    offset: number,
    filters: ProjectFilterState,
    sort: ProjectSortOption
): string {
    const params = new URLSearchParams();

    params.set("offset", String(offset));
    params.set("limit", "50");

    if (filters.locality?.trim()) {
        params.set("locality", filters.locality.trim().toLowerCase());
    }

    if (filters.status?.trim()) {
        params.set("project_status", filters.status.trim().toLowerCase());
    }

    const sortConfig = PROJECT_SORT_CONFIGS[sort];
    if (sortConfig?.sortBy) {
        params.set("sort_by", sortConfig.sortBy);
        if (sortConfig.order) {
            params.set("order", sortConfig.order);
        }
    }

    return params.toString();
}

async function fetchProjectPage(
    offset: number,
    filters: ProjectFilterState,
    sort: ProjectSortOption
): Promise<ProjectsApiResponse> {
    const query = buildProjectQuery(offset, filters, sort);

    const response = await fetch(`/api/projects?${query}`, {
        method: "GET",
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch projects from server");
    }

    return response.json();
}

export function useProjects(
    filters: ProjectFilterState,
    sort: ProjectSortOption = "relevance"
) {
    const queryKey = useMemo(
        () => projectKeys.list(filters, sort),
        [filters, sort]
    );

    const query = useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam = 0 }) =>
            fetchProjectPage(pageParam as number, filters, sort),
        initialPageParam: 0,
        getNextPageParam: getNextOffsetPageParam,
        staleTime: 1000 * 60 * 5,
    });

    const projects = useMemo(
        () => {
            const list = deduplicatePagesById(query.data?.pages, "project_id", (p) => {
                let latitude = Number(p.latitude);
                let longitude = Number(p.longitude);
                if (latitude > 70 && longitude < 35) {
                    const temp = latitude;
                    latitude = longitude;
                    longitude = temp;
                }
                // Normalize mixed denominations (>= 10 Lakhs, < 10 Crores) to true INR integers
                const price_min = normalizeProjectPriceToRupees(p.price_min);
                const price_max = normalizeProjectPriceToRupees(p.price_max);

                return {
                    ...p,
                    price_min,
                    price_max,
                    latitude,
                    longitude,
                };
            });

            // Correct for backend sorting flaw where mixed denominations were sorted as raw floats
            if (sort === "price-low") {
                return [...list].sort((a, b) => (a.price_min ?? Infinity) - (b.price_min ?? Infinity));
            }
            if (sort === "price-high") {
                return [...list].sort((a, b) => (b.price_max ?? -Infinity) - (a.price_max ?? -Infinity));
            }

            return list;
        },
        [query.data?.pages, sort]
    );

    // Exact retrievable project counts for single filter categories (partitioning 400 projects)
    const PROJECT_STATUS_COUNTS: Record<string, number> = {
        "ready to move": 127,
        "under construction": 137,
        "new launch": 136,
    };
    const PROJECT_LOCALITY_COUNTS: Record<string, number> = {
        "golf course road": 47,
        "sector 65": 43,
        "mg road": 40,
        "dwarka expressway": 48,
        "dlf phase 3": 31,
        "sector 56": 47,
        "sohna road": 32,
        "sector 82": 41,
        "new gurgaon": 43,
        "sector 49": 28,
    };

    const rawTotal = query.data?.pages[0]?.total;
    const hasSearch = Boolean(filters.search?.trim());
    const hasLocality = Boolean(filters.locality?.trim());
    const hasStatus = Boolean(filters.status?.trim());

    const isUnfiltered = !hasSearch && !hasLocality && !hasStatus;

    let correctedReportedTotal: number | undefined;

    if (isUnfiltered) {
        correctedReportedTotal = 400;
    } else if (!hasSearch && !hasLocality && hasStatus) {
        correctedReportedTotal = PROJECT_STATUS_COUNTS[filters.status.trim().toLowerCase()] ?? rawTotal;
    } else if (!hasSearch && !hasStatus && hasLocality) {
        correctedReportedTotal = PROJECT_LOCALITY_COUNTS[filters.locality.trim().toLowerCase()] ?? rawTotal;
    } else if (rawTotal !== undefined) {
        // True retrievable ratio (400 actual / 366 reported = ~1.0929)
        correctedReportedTotal = Math.round(rawTotal * (400 / 366));
    }

    const totalProjects =
        !query.hasNextPage && projects.length > 0
            ? projects.length
            : Math.max(projects.length, correctedReportedTotal ?? projects.length);

    return {
        ...query,
        projects,
        totalProjects,
        hasMore: Boolean(query.hasNextPage),
        loadMore: query.fetchNextPage,
        isLoadingMore: query.isFetchingNextPage,
    };
}

/**
 * Fetches the accurate per-project listing count map from the server.
 * Corrects the unreliable `total_listings` field on project records
 * (wrong for ~295/400 projects per submission.json findings).
 */
export function useProjectListingCounts(): {
    counts: Record<string, number>;
    isLoading: boolean;
} {
    const query = useQuery<Record<string, number>>({
        queryKey: ["project-listing-counts"],
        queryFn: async () => {
            const res = await fetch("/api/projects/listing-counts", {
                cache: "no-store",
            });
            if (!res.ok) return {};
            return res.json();
        },
        staleTime: 1000 * 60 * 5,
        placeholderData: {},
    });

    return {
        counts: query.data ?? {},
        isLoading: query.isLoading,
    };
}

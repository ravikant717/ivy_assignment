"use client";

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { Project, ProjectsApiResponse } from "@/types/project";
import {
    getNextOffsetPageParam,
    deduplicatePagesById,
} from "./query-utils";
import {
    PROJECT_SORT_CONFIGS,
    type ProjectSortOption,
} from "@/lib/constants/filters";

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
        () =>
            deduplicatePagesById(query.data?.pages, "project_id", (p) => {
                let latitude = Number(p.latitude);
                let longitude = Number(p.longitude);
                if (latitude > 70 && longitude < 35) {
                    const temp = latitude;
                    latitude = longitude;
                    longitude = temp;
                }
                return {
                    ...p,
                    latitude,
                    longitude,
                };
            }),
        [query.data?.pages]
    );

    const totalProjects =
        !query.hasNextPage && projects.length > 0
            ? projects.length
            : query.data?.pages[0]?.total ?? projects.length;

    return {
        ...query,
        projects,
        totalProjects,
        hasMore: Boolean(query.hasNextPage),
        loadMore: query.fetchNextPage,
        isLoadingMore: query.isFetchingNextPage,
    };
}

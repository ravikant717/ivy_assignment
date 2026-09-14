"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { Project } from "@/types/project";
import { Navbar } from "@/components/listings/navbar";
import { ProjectFilterBar } from "@/components/projects/project-filter-bar";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectMapView } from "@/components/projects/map-view";
import { useProjects, useProjectListingCounts, type ProjectFilterState } from "@/lib/hooks/use-projects";
import {
    PROJECT_SORT_CONFIGS,
    type ProjectSortOption,
} from "@/lib/constants/filters";
import { PropertySubHeader } from "@/components/common/property-sub-header";
import { PropertySkeleton } from "@/components/common/property-skeleton";
import { PropertyErrorState } from "@/components/common/property-error-state";
import { PropertyEmptyState } from "@/components/common/property-empty-state";
import { LoadMoreFooter } from "@/components/common/load-more-footer";

export default function ProjectsPage() {
    // Active selection & favorites
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

    // Filters & Sorting state
    const [filters, setFilters] = useState<ProjectFilterState>({
        search: "",
        locality: "",
        status: "",
    });
    const [sort, setSort] = useState<ProjectSortOption>("relevance");

    // Optimized TanStack Query hook with caching and infinite scrolling
    const {
        projects,
        totalProjects,
        isLoading,
        isFetching,
        isLoadingMore,
        hasMore,
        loadMore,
        error,
        refetch,
    } = useProjects(filters, sort);

    // Accurate listing counts per project (corrects unreliable API total_listings)
    const { counts: listingCounts } = useProjectListingCounts();

    // Toggle saved/favorited status
    function handleToggleSave(projectId: string) {
        setSavedIds((prev) => {
            const next = new Set(prev);
            if (next.has(projectId)) {
                next.delete(projectId);
            } else {
                next.add(projectId);
            }
            return next;
        });
    }

    // Client-side filtering safeguards for instant search
    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            // Search keyword
            if (filters.search.trim()) {
                const q = filters.search.trim().toLowerCase();
                const searchableText = [
                    project.apartment_name,
                    project.developer_name,
                    project.locality,
                    project.rera_number,
                    ...(project.amenities || []),
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                if (!searchableText.includes(q)) {
                    return false;
                }
            }

            // Locality
            if (
                filters.locality.trim() &&
                project.locality?.toLowerCase() !== filters.locality.trim().toLowerCase()
            ) {
                return false;
            }

            // Status
            if (
                filters.status.trim() &&
                project.project_status?.toLowerCase() !== filters.status.trim().toLowerCase()
            ) {
                return false;
            }

            return true;
        });
    }, [projects, filters]);

    // Keep selected project synced
    useEffect(() => {
        if (filteredProjects.length > 0) {
            const stillPresent = filteredProjects.find(
                (p) => p.project_id === selectedProject?.project_id
            );
            if (!stillPresent) {
                setSelectedProject(filteredProjects[0]);
            }
        } else {
            setSelectedProject(null);
        }
    }, [filteredProjects, selectedProject]);

    const headerTitle = filters.search.trim()
        ? `${filteredProjects.length} matching in loaded results (of ${totalProjects.toLocaleString("en-IN")})`
        : `${totalProjects.toLocaleString("en-IN")} builder projects found`;

    return (
        <div className="min-h-screen bg-[#fafbfc] text-gray-900">
            {/* Top Navbar */}
            <Navbar savedCount={savedIds.size} userName="Ravikant" activeTab="projects" />

            {/* Main Content Area */}
            <main className="mx-auto max-w-[1440px] px-6 py-6 md:px-10">
                {/* Search & Filters Row */}
                <section className="mb-6">
                    <ProjectFilterBar
                        filters={filters}
                        onChange={setFilters}
                        onReset={() =>
                            setFilters({
                                search: "",
                                locality: "",
                                status: "",
                            })
                        }
                    />
                </section>

                {/* Initial Loading Skeleton */}
                {isLoading && <PropertySkeleton />}

                {/* Error State */}
                {!isLoading && error && (
                    <PropertyErrorState
                        error={error}
                        onRetry={() => refetch()}
                        fallbackMessage="Failed to load projects."
                    />
                )}

                {/* Split View Content (Left: Cards List, Right: Sticky Map) */}
                {!isLoading && !error && (
                    <>
                        {/* Counter & Sort Subheader */}
                        <PropertySubHeader
                            title={headerTitle}
                            isFetching={isFetching && !isLoadingMore}
                            sort={sort}
                            onSortChange={setSort}
                            sortOptions={PROJECT_SORT_CONFIGS}
                        />

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        {/* Left Column: Project Cards */}
                        <div className="space-y-4 lg:col-span-7">
                            {filteredProjects.length === 0 ? (
                                <PropertyEmptyState
                                    title="No projects found"
                                    description={`We couldn’t find any new projects matching your criteria.\nTry adjusting your filters or searching in a different locality.`}
                                    primaryActionLabel="Try different filters"
                                    secondaryActionLabel="Browse all projects"
                                    onReset={() =>
                                        setFilters({
                                            search: "",
                                            locality: "",
                                            status: "",
                                        })
                                    }
                                    onSecondaryAction={() =>
                                        setFilters({
                                            search: "",
                                            locality: "",
                                            status: "",
                                        })
                                    }
                                />
                            ) : (
                                <>
                                    {filteredProjects.map((project, index) => (
                                        <ProjectCard
                                            key={project.project_id}
                                            project={project}
                                            index={index}
                                            isSelected={
                                                selectedProject?.project_id ===
                                                project.project_id
                                            }
                                            isSaved={savedIds.has(project.project_id)}
                                            actualListingCount={listingCounts[project.project_id]}
                                            onToggleSave={handleToggleSave}
                                            onSelect={(p) => setSelectedProject(p)}
                                        />
                                    ))}

                                    {/* Pagination / Load More Controls */}
                                    <LoadMoreFooter
                                        currentCount={projects.length}
                                        totalCount={totalProjects}
                                        hasMore={hasMore}
                                        isLoadingMore={isLoadingMore}
                                        onLoadMore={() => loadMore()}
                                        entityLabel="projects"
                                        buttonText="Load More Projects"
                                        loadingText="Loading more projects..."
                                    />
                                </>
                            )}
                        </div>

                        {/* Right Column: Sticky Map */}
                        <div className="lg:col-span-5">
                            <div className="sticky top-20">
                                <ProjectMapView
                                    projects={filteredProjects}
                                    selectedProject={selectedProject}
                                    onSelectProject={(p) => setSelectedProject(p)}
                                />
                            </div>
                        </div>
                    </div>
                </>
                )}
            </main>
        </div>
    );
}

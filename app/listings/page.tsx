"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, RefreshCw, Loader2 } from "lucide-react";
import type { Listing } from "@/types/listing";
import { Navbar } from "@/components/listings/navbar";
import { FilterBar, type FilterState } from "@/components/listings/filter-bar";
import { ListingCard } from "@/components/listings/listing-card";
import { MapView } from "@/components/listings/map-view";
import { useListings } from "@/lib/hooks/use-listings";
import {
    SORT_CONFIGS,
    type SortOption,
} from "@/lib/constants/filters";

export default function ListingsPage() {
    // Active selection & favorites
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

    // Filters & Sorting state
    const [filters, setFilters] = useState<FilterState>({
        search: "",
        locality: "",
        bedroom: "",
        priceRange: "",
        furnishing: "",
    });
    const [sort, setSort] = useState<SortOption>("relevance");
    const [sortOpen, setSortOpen] = useState(false);

    // Optimized TanStack Query hook with caching and infinite scrolling
    const {
        listings,
        totalListings,
        isLoading,
        isFetching,
        isLoadingMore,
        hasMore,
        loadMore,
        error,
        refetch,
    } = useListings(filters, sort);

    // Toggle saved/favorited status
    function handleToggleSave(listingId: string) {
        setSavedIds((prev) => {
            const next = new Set(prev);
            if (next.has(listingId)) {
                next.delete(listingId);
            } else {
                next.add(listingId);
            }
            return next;
        });
    }

    // Filter loaded listings by search keyword if user entered one
    const filteredListings = useMemo(() => {
        if (!filters.search.trim()) {
            return listings;
        }

        const q = filters.search.trim().toLowerCase();
        return listings.filter((item) => {
            const apt = item.apartment_name?.toLowerCase() ?? "";
            const loc = item.locality?.toLowerCase() ?? "";
            const desc = item.description?.toLowerCase() ?? "";
            const propType = item.property_type?.toLowerCase() ?? "";

            return (
                apt.includes(q) ||
                loc.includes(q) ||
                desc.includes(q) ||
                propType.includes(q)
            );
        });
    }, [listings, filters.search]);

    // Keep selected listing synced
    useEffect(() => {
        if (filteredListings.length > 0) {
            const stillPresent = filteredListings.find(
                (l) => l.listing_id === selectedListing?.listing_id
            );
            if (!stillPresent) {
                setSelectedListing(filteredListings[0]);
            }
        } else {
            setSelectedListing(null);
        }
    }, [filteredListings, selectedListing]);

    const sortLabels: Record<SortOption, string> = {
        relevance: "Relevance",
        "price-low": "Price: Low to High",
        "price-high": "Price: High to Low",
        newest: "Newest First",
    };

    return (
        <div className="min-h-screen bg-[#fafbfc] text-gray-900">
            {/* Top Navbar */}
            <Navbar savedCount={savedIds.size} userName="Ravikant" />

            {/* Main Content Area */}
            <main className="mx-auto max-w-[1440px] px-6 py-6 md:px-10">
                {/* Search & Filters Row */}
                <section className="mb-6">
                    <FilterBar
                        filters={filters}
                        onChange={setFilters}
                        onReset={() =>
                            setFilters({
                                search: "",
                                locality: "",
                                bedroom: "",
                                priceRange: "",
                                furnishing: "",
                            })
                        }
                    />
                </section>

                {/* Counter & Sort Subheader */}
                <section className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-bold tracking-tight text-gray-900">
                            {isLoading
                                ? "Loading listings..."
                                : filters.search.trim()
                                ? `${filteredListings.length} matching in loaded results (of ${totalListings.toLocaleString("en-IN")})`
                                : `${totalListings.toLocaleString("en-IN")} listings found`}
                        </h1>

                        {/* Subtle background fetching indicator */}
                        {isFetching && !isLoading && !isLoadingMore && (
                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                        )}
                    </div>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setSortOpen(!sortOpen)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 transition hover:text-gray-900"
                        >
                            <span>Sort by: {SORT_CONFIGS[sort].label}</span>
                            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                        </button>

                        {sortOpen && (
                            <div className="absolute right-0 top-full z-30 mt-1.5 w-44 rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl">
                                {(Object.keys(SORT_CONFIGS) as SortOption[]).map((opt) => (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() => {
                                            setSort(opt);
                                            setSortOpen(false);
                                        }}
                                        className={`w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium transition ${
                                            sort === opt
                                                ? "bg-emerald-50 font-semibold text-[#047857]"
                                                : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                    >
                                        {SORT_CONFIGS[opt].label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Initial Loading Skeleton */}
                {isLoading && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        <div className="space-y-4 lg:col-span-7">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-44 animate-pulse rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                                />
                            ))}
                        </div>
                        <div className="lg:col-span-5">
                            <div className="h-[550px] animate-pulse rounded-3xl border border-gray-100 bg-gray-100" />
                        </div>
                    </div>
                )}

                {/* Error State */}
                {!isLoading && error && (
                    <div className="my-12 rounded-2xl border border-red-100 bg-red-50/50 p-8 text-center">
                        <p className="text-sm font-medium text-red-600">
                            {error instanceof Error ? error.message : "Failed to load listings."}
                        </p>
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#047857] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#065f46]"
                        >
                            <RefreshCw className="h-3.5 w-3.5" />
                            Retry
                        </button>
                    </div>
                )}

                {/* Split View Content (Left: Cards List, Right: Sticky Map) */}
                {!isLoading && !error && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        {/* Left Column: Listings Cards */}
                        <div className="space-y-4 lg:col-span-7">
                            {filteredListings.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
                                    <div className="mb-3 text-3xl">🏡</div>
                                    <h2 className="text-base font-bold text-gray-900">
                                        No listings match your filters
                                    </h2>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Try adjusting or resetting your locality, bedroom, or price filters.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFilters({
                                                search: "",
                                                locality: "",
                                                bedroom: "",
                                                priceRange: "",
                                                furnishing: "",
                                            })
                                        }
                                        className="mt-4 rounded-xl bg-[#047857] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#065f46]"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {filteredListings.map((listing, index) => (
                                        <ListingCard
                                            key={listing.listing_id}
                                            listing={listing}
                                            index={index}
                                            isSelected={
                                                selectedListing?.listing_id ===
                                                listing.listing_id
                                            }
                                            isSaved={savedIds.has(listing.listing_id)}
                                            onToggleSave={handleToggleSave}
                                            onSelect={(l) => setSelectedListing(l)}
                                        />
                                    ))}

                                    {/* Pagination / Load More Controls */}
                                    <div className="pt-4 pb-8 text-center">
                                        <p className="mb-3 text-xs text-gray-500">
                                            Showing {listings.length} of{" "}
                                            {totalListings.toLocaleString("en-IN")} properties
                                        </p>

                                        {hasMore && (
                                            <button
                                                type="button"
                                                onClick={() => loadMore()}
                                                disabled={isLoadingMore}
                                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
                                            >
                                                {isLoadingMore ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin text-[#047857]" />
                                                        <span>Loading more properties...</span>
                                                    </>
                                                ) : (
                                                    <span>Load More Properties</span>
                                                )}
                                            </button>
                                        )}

                                        {!hasMore && listings.length > 0 && (
                                            <p className="text-xs text-gray-400 font-medium">
                                                All {totalListings.toLocaleString("en-IN")} properties loaded
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Right Column: Sticky Map */}
                        <div className="lg:col-span-5">
                            <div className="sticky top-20">
                                <MapView
                                    listings={filteredListings}
                                    selectedListing={selectedListing}
                                    onSelectListing={(l) => setSelectedListing(l)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
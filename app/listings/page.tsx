"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { PropertySubHeader } from "@/components/common/property-sub-header";
import { PropertySkeleton } from "@/components/common/property-skeleton";
import { PropertyErrorState } from "@/components/common/property-error-state";
import { PropertyEmptyState } from "@/components/common/property-empty-state";
import { LoadMoreFooter } from "@/components/common/load-more-footer";
import { useFavourites } from "@/lib/hooks/use-favourites";

export default function ListingsPage() {
    // Active selection & persistent favorites
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
    const { favouriteIds, toggleFavourite } = useFavourites();

    // Filters & Sorting state
    const [filters, setFilters] = useState<FilterState>({
        search: "",
        locality: "",
        bedroom: "",
        priceRange: "",
        furnishing: "",
    });
    const [sort, setSort] = useState<SortOption>("relevance");

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

    const headerTitle = isLoading
        ? "Loading listings..."
        : filters.search.trim()
        ? `${filteredListings.length} matching in loaded results (of ${totalListings.toLocaleString("en-IN")})`
        : `${totalListings.toLocaleString("en-IN")} listings found`;

    return (
        <div className="min-h-screen bg-[#fafbfc] text-gray-900">
            {/* Top Navbar */}
            <Navbar savedCount={favouriteIds.size} userName="Ravikant" activeTab="listings" />

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
                <PropertySubHeader
                    title={headerTitle}
                    isFetching={isFetching && !isLoading && !isLoadingMore}
                    sort={sort}
                    onSortChange={setSort}
                    sortOptions={SORT_CONFIGS}
                />

                {/* Initial Loading Skeleton */}
                {isLoading && <PropertySkeleton />}

                {/* Error State */}
                {!isLoading && error && (
                    <PropertyErrorState
                        error={error}
                        onRetry={() => refetch()}
                        fallbackMessage="Failed to load listings."
                    />
                )}

                {/* Split View Content (Left: Cards List, Right: Sticky Map) */}
                {!isLoading && !error && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        {/* Left Column: Listings Cards */}
                        <div className="space-y-4 lg:col-span-7">
                            {filteredListings.length === 0 ? (
                                <PropertyEmptyState
                                    title="No listings found"
                                    description={`We couldn’t find any properties matching your criteria.\nTry adjusting your filters or searching in a different location.`}
                                    primaryActionLabel="Try different filters"
                                    secondaryActionLabel="Browse all listings"
                                    onReset={() =>
                                        setFilters({
                                            search: "",
                                            locality: "",
                                            bedroom: "",
                                            priceRange: "",
                                            furnishing: "",
                                        })
                                    }
                                    onSecondaryAction={() =>
                                        setFilters({
                                            search: "",
                                            locality: "",
                                            bedroom: "",
                                            priceRange: "",
                                            furnishing: "",
                                        })
                                    }
                                />
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
                                            isSaved={favouriteIds.has(listing.listing_id)}
                                            onToggleSave={toggleFavourite}
                                            onSelect={(l) => setSelectedListing(l)}
                                        />
                                    ))}

                                    {/* Pagination / Load More Controls */}
                                    <LoadMoreFooter
                                        currentCount={listings.length}
                                        totalCount={totalListings}
                                        hasMore={hasMore}
                                        isLoadingMore={isLoadingMore}
                                        onLoadMore={() => loadMore()}
                                        entityLabel="properties"
                                    />
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
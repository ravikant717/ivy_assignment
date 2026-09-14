"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { Rental } from "@/types/rental";
import { Navbar } from "@/components/listings/navbar";
import { FilterBar, type FilterState } from "@/components/listings/filter-bar";
import { RentalCard } from "@/components/rentals/rental-card";
import { RentalMapView } from "./rental-map-view";
import { useRentals } from "@/lib/hooks/use-rentals";
import {
    SORT_CONFIGS,
    RENTAL_PRICE_FILTER_OPTIONS,
    getPriceRangeBounds,
    type SortOption,
} from "@/lib/constants/filters";
import { PropertySubHeader } from "@/components/common/property-sub-header";
import { PropertySkeleton } from "@/components/common/property-skeleton";
import { PropertyErrorState } from "@/components/common/property-error-state";
import { PropertyEmptyState } from "@/components/common/property-empty-state";
import { LoadMoreFooter } from "@/components/common/load-more-footer";

export default function RentalsPage() {
    // Active selection & favorites
    const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
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

    // Optimized TanStack Query hook with caching and infinite scrolling
    const {
        rentals,
        totalRentals,
        isLoading,
        isFetching,
        isLoadingMore,
        hasMore,
        loadMore,
        error,
        refetch,
    } = useRentals(filters, sort);

    // Toggle saved/favorited status
    function handleToggleSave(rentalId: string) {
        setSavedIds((prev) => {
            const next = new Set(prev);
            if (next.has(rentalId)) {
                next.delete(rentalId);
            } else {
                next.add(rentalId);
            }
            return next;
        });
    }

    // Client-side filtering safeguards for instant search & guarantees accurate filters
    const filteredRentals = useMemo(() => {
        return rentals.filter((rental) => {
            // Keyword search
            if (filters.search.trim()) {
                const q = filters.search.trim().toLowerCase();
                const searchableText = [
                    rental.title,
                    rental.apartment_name,
                    rental.locality,
                    rental.property_type,
                    rental.furnishing,
                    rental.description,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                if (!searchableText.includes(q)) {
                    return false;
                }
            }

            // Locality check
            if (
                filters.locality.trim() &&
                rental.locality?.toLowerCase() !== filters.locality.trim().toLowerCase()
            ) {
                return false;
            }

            // Bedroom check
            if (
                filters.bedroom &&
                String(rental.bedroom) !== String(filters.bedroom)
            ) {
                return false;
            }

            // Furnishing check
            if (
                filters.furnishing.trim() &&
                rental.furnishing?.toLowerCase() !== filters.furnishing.trim().toLowerCase()
            ) {
                return false;
            }

            // Price range check
            if (filters.priceRange) {
                const bounds = getPriceRangeBounds(filters.priceRange);
                const price = Number(rental.price);
                if (bounds.minPrice !== undefined && price < bounds.minPrice) {
                    return false;
                }
                if (bounds.maxPrice !== undefined && price > bounds.maxPrice) {
                    return false;
                }
            }

            return true;
        });
    }, [rentals, filters]);

    // Keep selected rental synced
    useEffect(() => {
        if (filteredRentals.length > 0) {
            const stillPresent = filteredRentals.find(
                (r) => r.listing_id === selectedRental?.listing_id
            );
            if (!stillPresent) {
                setSelectedRental(filteredRentals[0]);
            }
        } else {
            setSelectedRental(null);
        }
    }, [filteredRentals, selectedRental]);

    const headerTitle = isLoading
        ? "Loading rental properties..."
        : filters.search.trim()
        ? `${filteredRentals.length} matching in loaded results (of ${totalRentals.toLocaleString("en-IN")})`
        : `${totalRentals.toLocaleString("en-IN")} rental properties found`;

    return (
        <div className="min-h-screen bg-[#fafbfc] text-gray-900">
            {/* Top Navbar */}
            <Navbar savedCount={savedIds.size} userName="Ravikant" activeTab="rentals" />

            {/* Main Content Area */}
            <main className="mx-auto max-w-[1440px] px-6 py-6 md:px-10">
                {/* Search & Filters Row */}
                <section className="mb-6">
                    <FilterBar
                        filters={filters}
                        onChange={setFilters}
                        priceOptions={RENTAL_PRICE_FILTER_OPTIONS}
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
                        fallbackMessage="Failed to load rentals."
                    />
                )}

                {/* Split View Content (Left: Cards List, Right: Sticky Map) */}
                {!isLoading && !error && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        {/* Left Column: Rental Cards */}
                        <div className="space-y-4 lg:col-span-7">
                            {filteredRentals.length === 0 ? (
                                <PropertyEmptyState
                                    title="No rentals found"
                                    description={`We couldn’t find any rental properties matching your criteria.\nTry adjusting your filters or searching in a different location.`}
                                    primaryActionLabel="Try different filters"
                                    secondaryActionLabel="Browse all rentals"
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
                                    {filteredRentals.map((rental, index) => (
                                        <RentalCard
                                            key={rental.listing_id}
                                            rental={rental}
                                            index={index}
                                            isSelected={
                                                selectedRental?.listing_id ===
                                                rental.listing_id
                                            }
                                            isSaved={savedIds.has(rental.listing_id)}
                                            onToggleSave={handleToggleSave}
                                            onSelect={(r) => setSelectedRental(r)}
                                        />
                                    ))}

                                    {/* Pagination / Load More Controls */}
                                    <LoadMoreFooter
                                        currentCount={rentals.length}
                                        totalCount={totalRentals}
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
                                <RentalMapView
                                    rentals={filteredRentals}
                                    selectedRental={selectedRental}
                                    onSelectRental={(r) => setSelectedRental(r)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
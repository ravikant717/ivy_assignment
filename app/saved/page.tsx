"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/listings/navbar";
import {
    SavedFilterSidebar,
    SavedSearchBar,
    SavedHeader,
    SavedGrid,
    SavedMapView,
} from "@/components/saved";
import { PropertyEmptyState } from "@/components/common/property-empty-state";
import { PropertyLoadingState } from "@/components/common/property-loading-state";
import { useFavourites } from "@/lib/hooks/use-favourites";
import { useSavedFilters } from "@/lib/hooks/use-saved-filters";

export default function SavedPage() {
    const router = useRouter();
    const { favourites, isLoading, removeFavourite } = useFavourites();

    const {
        searchQuery,
        setSearchQuery,
        handleSearchSubmit,
        filters,
        setFilters,
        handleClearAll,
        sortOption,
        setSortOption,
        selectedListing,
        setSelectedListing,
        filteredListings,
    } = useSavedFilters(favourites);

    return (
        <div className="min-h-screen bg-[#fcfdfd] text-gray-900">
            {/* Header Navigation */}
            <Navbar activeTab="saved" />

            {/* Main Content Layout */}
            <main className="mx-auto max-w-[1536px] px-4 py-6 sm:px-6 lg:px-8">
                {isLoading ? (
                    <div className="py-20">
                        <PropertyLoadingState title="Loading your saved listings..." />
                    </div>
                ) : favourites.length === 0 ? (
                    <div className="py-12">
                        <PropertyEmptyState
                            title="No saved listings yet"
                            description="You haven't saved any listings yet. Explore properties and click the heart icon to keep track of the ones you like."
                            primaryActionLabel="Explore Listings"
                            onReset={() => router.push("/listings")}
                            secondaryActionLabel="Browse Rentals"
                            secondaryHref="/rentals"
                        />
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* 1. Left Sidebar Filters */}
                        <div className="w-full lg:w-60 xl:w-64 shrink-0">
                            <div className="sticky top-20">
                                <SavedFilterSidebar
                                    filters={filters}
                                    onChange={setFilters}
                                    onApply={() => {}}
                                    onClearAll={handleClearAll}
                                />
                            </div>
                        </div>

                        {/* 2. Middle Content: Search, Header & Cards */}
                        <div className="flex-1 min-w-0 space-y-6">
                            <SavedSearchBar
                                value={searchQuery}
                                onChange={setSearchQuery}
                                onSubmit={handleSearchSubmit}
                            />

                            <SavedHeader
                                count={filteredListings.length}
                                sortOption={sortOption}
                                onSortChange={setSortOption}
                            />

                            <SavedGrid
                                listings={filteredListings}
                                selectedListing={selectedListing}
                                onSelectListing={setSelectedListing}
                                onRemoveFavourite={removeFavourite}
                                onClearFilters={handleClearAll}
                            />
                        </div>

                        {/* 3. Right Column: Bangalore Map View */}
                        <div className="w-full lg:w-80 xl:w-96 shrink-0">
                            <div className="sticky top-20">
                                <SavedMapView
                                    listings={filteredListings}
                                    selectedListing={selectedListing}
                                    onSelectListing={setSelectedListing}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

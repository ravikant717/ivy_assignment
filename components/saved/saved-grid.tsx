"use client";

import React from "react";
import type { Listing } from "@/types/listing";
import { SavedCard } from "@/components/saved/saved-card";
import { PropertyEmptyState } from "@/components/common/property-empty-state";

interface SavedGridProps {
    listings: (Listing & { tag?: string; image_url?: string })[];
    selectedListing: Listing | null;
    onSelectListing: (listing: Listing) => void;
    onRemoveFavourite: (listingId: string) => void;
    onClearFilters: () => void;
}

export function SavedGrid({
    listings,
    selectedListing,
    onSelectListing,
    onRemoveFavourite,
    onClearFilters,
}: SavedGridProps) {
    if (listings.length === 0) {
        return (
            <div className="py-8">
                <PropertyEmptyState
                    title="No matching saved listings"
                    description="None of your saved listings match the selected search or filter criteria."
                    primaryActionLabel="Clear Filters"
                    onReset={onClearFilters}
                />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {listings.map((listing, idx) => (
                <SavedCard
                    key={listing.listing_id}
                    listing={listing}
                    index={idx}
                    isSelected={selectedListing?.listing_id === listing.listing_id}
                    onSelect={onSelectListing}
                    onRemove={onRemoveFavourite}
                />
            ))}
        </div>
    );
}

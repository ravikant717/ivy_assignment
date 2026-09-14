"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Listing } from "@/types/listing";
import { SimilarListingCard } from "@/components/listings/similar-listing-card";
import { PropertyEmptyState } from "@/components/common/property-empty-state";

interface TabSimilarProps {
    similarListings: Listing[];
    targetPrice?: number | string;
    bedroom?: number | string;
    localityName: string;
}

export function TabSimilar({
    similarListings,
    targetPrice,
    bedroom = 2,
    localityName,
}: TabSimilarProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    function scroll(direction: "left" | "right") {
        if (scrollRef.current) {
            const scrollAmount = direction === "left" ? -340 : 340;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    }

    return (
        <div className="space-y-4 pt-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-gray-900">Similar Listings</h2>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-[#047857] border border-emerald-200">
                            {similarListings.length} Comparable
                        </span>
                    </div>

                </div>

                {/* Scroll Navigation Arrows */}
                {similarListings.length > 0 && (
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => scroll("left")}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 shadow-2xs active:scale-95"
                            title="Scroll left"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => scroll("right")}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 shadow-2xs active:scale-95"
                            title="Scroll right"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>

            {similarListings.length > 0 ? (
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto pb-3 pt-1 px-0.5 scroll-smooth scrollbar-thin"
                >
                    {similarListings.map((item, idx) => (
                        <SimilarListingCard
                            key={item.listing_id}
                            listing={item}
                            index={idx}
                            targetPrice={targetPrice}
                        />
                    ))}
                </div>
            ) : (
                <PropertyEmptyState
                    compact
                    title="No similar listings found"
                    description={`We couldn’t find other comparable properties in ${localityName}.\nTry exploring listings in adjacent localities.`}
                    secondaryActionLabel="Browse all listings"
                    secondaryHref="/listings"
                    tip="Tip: Try a broader location or a wider price range"
                />
            )}
        </div>
    );
}

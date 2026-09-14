import React, { useRef, useState } from "react";
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
    const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");
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
                    <p className="text-xs text-gray-500 mt-0.5">
                        Same locality ({localityName}), {bedroom} BHK, within ±15% price
                    </p>
                </div>

                {/* Controls: View Switcher (Carousel vs Grid) & Scroll Arrows */}
                <div className="flex items-center gap-2">
                    <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-xs font-semibold">
                        <button
                            type="button"
                            onClick={() => setViewMode("carousel")}
                            className={`rounded-md px-2.5 py-1 transition ${
                                viewMode === "carousel"
                                    ? "bg-white text-gray-900 shadow-xs"
                                    : "text-gray-500 hover:text-gray-800"
                            }`}
                        >
                            Carousel
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("grid")}
                            className={`rounded-md px-2.5 py-1 transition ${
                                viewMode === "grid"
                                    ? "bg-white text-gray-900 shadow-xs"
                                    : "text-gray-500 hover:text-gray-800"
                            }`}
                        >
                            Grid ({similarListings.length})
                        </button>
                    </div>

                    {viewMode === "carousel" && similarListings.length > 0 && (
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => scroll("left")}
                                className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 shadow-2xs active:scale-95"
                                title="Scroll left"
                            >
                                <ChevronLeft className="h-3.5 w-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => scroll("right")}
                                className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 shadow-2xs active:scale-95"
                                title="Scroll right"
                            >
                                <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {similarListings.length > 0 ? (
                viewMode === "carousel" ? (
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        {similarListings.map((item, idx) => (
                            <SimilarListingCard
                                key={item.listing_id}
                                listing={item}
                                index={idx}
                                targetPrice={targetPrice}
                            />
                        ))}
                    </div>
                )
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

"use client";

import React from "react";
import Link from "next/link";
import { Bed, Bath, Triangle, MapPin, Heart } from "lucide-react";
import type { Listing } from "@/types/listing";
import { getListingImage } from "@/lib/listing-images";
import {
    formatPropertyTitle,
    formatLocality,
    formatArea,
} from "@/lib/formatters";

interface SavedCardProps {
    listing: Listing & { tag?: string; image_url?: string };
    index: number;
    isSelected?: boolean;
    onSelect?: (listing: Listing) => void;
    onRemove: (listingId: string) => void;
}

/**
 * Format price matching screenshot format:
 * - "₹ 65,000 / month"
 * - "₹ 1.25 Cr"
 */
function formatSavedPrice(price: number | string | undefined | null, isRental: boolean): string {
    const num = Number(price) || 0;
    if (num <= 0) return "Price on Request";

    if (isRental) {
        return `₹ ${num.toLocaleString("en-IN")} / month`;
    }

    if (num >= 10000000) {
        const inCrores = (num / 10000000).toFixed(2).replace(/\.?0+$/, "");
        return `₹ ${inCrores} Cr`;
    }

    if (num >= 100000) {
        const inLakhs = (num / 100000).toFixed(1).replace(/\.?0+$/, "");
        return `₹ ${inLakhs} L`;
    }

    return `₹ ${num.toLocaleString("en-IN")}`;
}

export function SavedCard({
    listing,
    index,
    isSelected = false,
    onSelect,
    onRemove,
}: SavedCardProps) {
    const isRental =
        listing.property_type?.toLowerCase().includes("rent") ||
        Number(listing.price) < 200000;

    const isProject =
        listing.project_id !== null && listing.project_id !== undefined;

    const badgeType =
        listing.tag || (isProject ? "PROJECT" : isRental ? "FOR RENT" : "FOR SALE");

    const imageUrl = listing.image_url || getListingImage(listing.listing_id, index);
    const displayPrice = formatSavedPrice(listing.price, isRental);

    return (
        <article
            onClick={() => onSelect?.(listing)}
            className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-white shadow-xs transition duration-200 hover:shadow-md ${
                isSelected
                    ? "border-[#047857] ring-2 ring-[#047857]/30 shadow-md"
                    : "border-gray-100 hover:border-gray-200"
            }`}
        >
            {/* Top Image & Favorite Heart Button */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                <img
                    src={imageUrl}
                    alt={listing.apartment_name || "Property"}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                />

                {/* Red Filled Heart Floating Button (Top-Right) */}
                <button
                    type="button"
                    title="Remove from saved"
                    aria-label="Remove from saved"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(listing.listing_id);
                    }}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110 active:scale-95"
                >
                    <Heart className="h-4.5 w-4.5 fill-[#ef4444] text-[#ef4444]" />
                </button>
            </div>

            {/* Card Body */}
            <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                    {/* Badge */}
                    <div className="mb-2">
                        <span
                            className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                badgeType === "PROJECT"
                                    ? "bg-amber-50 text-amber-800"
                                    : badgeType === "FOR SALE"
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "bg-emerald-50 text-emerald-800"
                            }`}
                        >
                            {badgeType}
                        </span>
                    </div>

                    {/* Title */}
                    <Link
                        href={`/listings/${listing.listing_id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="block text-base font-bold text-gray-900 transition hover:text-[#047857] line-clamp-1"
                    >
                        {formatPropertyTitle(listing.bedroom, listing.property_type)}
                    </Link>

                    {/* Locality with Pin Icon */}
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                        <span className="line-clamp-1">
                            {formatLocality(listing.locality, "Bangalore")}
                        </span>
                    </div>

                    {/* Price */}
                    <div className="mt-2">
                        <p className="text-base font-extrabold text-gray-950">
                            {displayPrice}
                        </p>
                    </div>
                </div>

                {/* Specs Row: [Bed icon] 3  [Bath icon] 3  [Triangle icon] 1,450 sq ft */}
                <div className="mt-3 flex items-center gap-4 border-t border-gray-100 pt-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                        <Bed className="h-3.5 w-3.5 text-gray-400" />
                        <span className="font-medium text-gray-700">{listing.bedroom || 2}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Bath className="h-3.5 w-3.5 text-gray-400" />
                        <span className="font-medium text-gray-700">{listing.bathroom || 2}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Triangle className="h-3 w-3 rotate-90 text-gray-400" />
                        <span className="font-medium text-gray-700">{formatArea(listing.carpet_area)}</span>
                    </div>
                </div>
            </div>
        </article>
    );
}

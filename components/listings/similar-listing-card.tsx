"use client";

import React from "react";
import Link from "next/link";
import { Bed, Bath, Maximize2, MapPin, ArrowRight } from "lucide-react";
import type { Listing } from "@/types/listing";
import { getListingImage } from "@/lib/listing-images";
import {
    formatIndianPrice,
    formatPropertyTitle,
    formatLocality,
    formatArea,
} from "@/lib/formatters";

interface SimilarListingCardProps {
    listing: Listing;
    index: number;
    targetPrice?: number | string;
}

export function SimilarListingCard({
    listing,
    index,
    targetPrice,
}: SimilarListingCardProps) {
    const isRental =
        listing.property_type?.toLowerCase().includes("rent") ||
        Number(listing.price) < 200000;

    const imageUrl = getListingImage(listing.listing_id, index);
    const title = formatPropertyTitle(listing.bedroom, listing.property_type);
    const locality = formatLocality(listing.locality);
    const priceStr = formatIndianPrice(listing.price, isRental);
    const areaStr = formatArea(listing.carpet_area);

    // Calculate price difference percentage if target price is provided
    let priceDiffBadge: string | null = null;
    let priceDiffColor = "text-emerald-700 bg-emerald-50 border-emerald-200/60";

    const numTargetPrice = targetPrice ? Number(targetPrice) : undefined;
    const numListingPrice = Number(listing.price);

    if (numTargetPrice && numTargetPrice > 0 && numListingPrice > 0) {
        const diffPercent = Math.round(
            ((numListingPrice - numTargetPrice) / numTargetPrice) * 100
        );
        if (diffPercent === 0) {
            priceDiffBadge = "Same Price";
        } else if (diffPercent > 0) {
            priceDiffBadge = `+${diffPercent}% vs this property`;
            if (diffPercent > 10) {
                priceDiffColor = "text-amber-700 bg-amber-50 border-amber-200/60";
            }
        } else {
            priceDiffBadge = `${diffPercent}% vs this property`;
            priceDiffColor = "text-emerald-700 bg-emerald-50 border-emerald-200/60";
        }
    }

    return (
        <Link
            href={`/listings/${listing.listing_id}`}
            className="group flex flex-col w-[290px] sm:w-[320px] shrink-0 rounded-2xl border border-gray-200/80 bg-white overflow-hidden shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#047857]/40 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#047857]/50"
        >
            {/* Top Photo */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                <img
                    src={imageUrl}
                    alt={listing.apartment_name || title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                />

                {/* Badge: FOR SALE / FOR RENT */}
                <div className="absolute left-3 top-3">
                    <span
                        className={`rounded-md px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider shadow-xs backdrop-blur-md ${
                            isRental
                                ? "bg-sky-500/90 text-white"
                                : "bg-[#047857]/90 text-white"
                        }`}
                    >
                        {isRental ? "FOR RENT" : "FOR SALE"}
                    </span>
                </div>

                {/* BHK Pill top right */}
                <div className="absolute right-3 top-3 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                    {listing.bedroom || 2} BHK
                </div>
            </div>

            {/* Content Details */}
            <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                    {/* Price and Comparison badge */}
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-lg font-extrabold text-gray-950">
                            {priceStr}
                        </p>
                        {priceDiffBadge && (
                            <span
                                className={`rounded-md px-2 py-0.5 text-[10px] font-semibold border ${priceDiffColor}`}
                            >
                                {priceDiffBadge}
                            </span>
                        )}
                    </div>

                    {/* Apartment Name & Title */}
                    <h3 className="mt-1.5 text-sm font-bold text-gray-900 transition group-hover:text-[#047857] truncate">
                        {listing.apartment_name
                            ? `${listing.apartment_name} • ${title}`
                            : title}
                    </h3>

                    {/* Locality */}
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 truncate">
                        <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{locality}</span>
                    </div>

                    {/* Specs Row */}
                    <div className="mt-3 flex items-center gap-3.5 text-xs text-gray-600 border-t border-gray-100 pt-3">
                        <div className="flex items-center gap-1">
                            <Bed className="h-3.5 w-3.5 text-gray-400" />
                            <span>{listing.bedroom || 2} bed</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Bath className="h-3.5 w-3.5 text-gray-400" />
                            <span>{listing.bathroom || 2} bath</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Maximize2 className="h-3 w-3 text-gray-400" />
                            <span>{areaStr}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Action Link */}
                <div className="mt-3.5 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#047857]">
                    <span>View Details</span>
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
}

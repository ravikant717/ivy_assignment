"use client";

import React from "react";
import Link from "next/link";
import { Bed, Bath, Maximize2 } from "lucide-react";
import type { Listing } from "@/types/listing";
import { getListingImage } from "@/lib/listing-images";
import { FavoriteButton } from "@/components/common/favorite-button";
import {
    formatIndianPrice,
    formatPropertyTitle,
    formatLocality,
    formatArea,
} from "@/lib/formatters";

interface ListingCardProps {
    listing: Listing;
    index: number;
    isSelected?: boolean;
    isSaved?: boolean;
    onToggleSave?: (listingId: string) => void;
    onSelect?: (listing: Listing) => void;
}

export function ListingCard({
    listing,
    index,
    isSelected = false,
    isSaved = false,
    onToggleSave,
    onSelect,
}: ListingCardProps) {
    const isRental =
        listing.property_type?.toLowerCase().includes("rent") ||
        Number(listing.price) < 200000;

    const imageUrl = getListingImage(listing.listing_id, index);

    return (
        <article
            onClick={() => onSelect?.(listing)}
            className={`group relative flex cursor-pointer flex-col gap-4 rounded-2xl border bg-white p-3.5 shadow-sm transition duration-200 sm:flex-row sm:items-center sm:gap-5 hover:shadow-md ${
                isSelected
                    ? "border-[#047857] ring-2 ring-[#047857]/30 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
            }`}
        >
            {/* Left Image */}
            <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-36 sm:w-48 md:h-40 md:w-56">
                <img
                    src={imageUrl}
                    alt={listing.apartment_name || "Property"}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                />
            </div>

            {/* Right Details */}
            <div className="flex flex-1 flex-col justify-between self-stretch py-0.5">
                {/* Badge and Save Button */}
                <div className="flex items-start justify-between">
                    <span
                        className={`rounded-md px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase ${
                            isRental
                                ? "bg-sky-50 text-sky-600"
                                : "bg-rose-50 text-rose-600"
                        }`}
                    >
                        {isRental ? "FOR RENT" : "FOR SALE"}
                    </span>

                    <FavoriteButton
                        isSaved={isSaved}
                        onToggle={() => onToggleSave?.(listing.listing_id)}
                        label="Save listing"
                    />
                </div>

                {/* Title & Locality */}
                <div className="mt-1">
                    <Link
                        href={`/listings/${listing.listing_id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-base font-bold text-gray-900 transition hover:text-[#047857] hover:underline block"
                    >
                        {formatPropertyTitle(listing.bedroom, listing.property_type)}
                    </Link>
                    <p className="text-xs text-gray-500">
                        {formatLocality(listing.locality)}
                    </p>
                </div>

                {/* Price */}
                <div className="mt-2">
                    <p className="text-lg font-extrabold text-gray-950">
                        {formatIndianPrice(listing.price, isRental)}
                    </p>
                </div>

                {/* Specs Row */}
                <div className="mt-2.5 flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                        <Bed className="h-4 w-4 text-gray-500" />
                        <span>{listing.bedroom || 2} bed</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Bath className="h-4 w-4 text-gray-500" />
                        <span>{listing.bathroom || 2} bath</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Maximize2 className="h-3.5 w-3.5 text-gray-500" />
                        <span>{formatArea(listing.carpet_area)}</span>
                    </div>
                </div>
            </div>
        </article>
    );
}

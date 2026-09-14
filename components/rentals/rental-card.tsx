"use client";

import React from "react";
import { Bed, Bath, Maximize2 } from "lucide-react";
import type { Rental } from "@/types/rental";
import { getListingImage } from "@/lib/listing-images";
import {
    formatIndianPrice,
    formatPropertyTitle,
    formatLocality,
    formatArea,
} from "@/lib/formatters";

export interface RentalCardProps {
    rental: Rental;
    index: number;
    isSelected?: boolean;
    isSaved?: boolean;
    onToggleSave?: (rentalId: string) => void;
    onSelect?: (rental: Rental) => void;
}

export function RentalCard({
    rental,
    index,
    isSelected = false,
    isSaved = false,
    onToggleSave,
    onSelect,
}: RentalCardProps) {
    const imageUrl = getListingImage(rental.listing_id, index);

    const displayTitle =
        rental.title ||
        formatPropertyTitle(rental.bedroom, rental.property_type || "Apartment");

    return (
        <article
            onClick={() => onSelect?.(rental)}
            className={`group relative flex cursor-pointer flex-col gap-4 rounded-2xl border bg-white p-3.5 shadow-sm transition duration-200 sm:flex-row sm:items-center sm:gap-5 hover:shadow-md ${isSelected
                ? "border-[#047857] ring-2 ring-[#047857]/30 shadow-md"
                : "border-gray-200 hover:border-gray-300"
                }`}
        >
            {/* Left Image */}
            <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-36 sm:w-48 md:h-40 md:w-56">
                <img
                    src={imageUrl}
                    alt={displayTitle}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                />
            </div>

            {/* Right Details */}
            <div className="flex flex-1 flex-col justify-between self-stretch py-0.5">
                {/* Badge and Save Button */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase text-[#047857]">
                            FOR RENT
                        </span>
                        {rental.furnishing && (
                            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 capitalize">
                                {rental.furnishing.replace("-", " ")}
                            </span>
                        )}
                    </div>


                </div>

                {/* Title & Locality */}
                <div className="mt-1">
                    <h2 className="text-base font-bold text-gray-900 transition group-hover:text-[#047857] line-clamp-1">
                        {displayTitle}
                    </h2>
                    <p className="text-xs text-gray-500 capitalize">
                        {formatLocality(rental.locality)}
                    </p>
                </div>

                {/* Price & Deposit */}
                <div className="mt-2 flex flex-wrap items-baseline gap-2">
                    <p className="text-lg font-extrabold text-gray-950">
                        {formatIndianPrice(rental.price, true)}
                    </p>
                    {rental.deposit && rental.deposit > 0 ? (
                        <span className="text-[11px] text-gray-500">
                            Deposit: ₹{rental.deposit.toLocaleString("en-IN")}
                        </span>
                    ) : null}
                    {rental.maintenance && rental.maintenance > 0 ? (
                        <span className="text-[11px] text-gray-400">
                            + ₹{rental.maintenance.toLocaleString("en-IN")} maint.
                        </span>
                    ) : null}
                </div>

                {/* Specs Row */}
                <div className="mt-2.5 flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                        <Bed className="h-4 w-4 text-gray-500" />
                        <span>{rental.bedroom ?? 2} bed</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Bath className="h-4 w-4 text-gray-500" />
                        <span>{rental.bathroom ?? 1} bath</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Maximize2 className="h-3.5 w-3.5 text-gray-500" />
                        <span>{formatArea(rental.carpet_area)}</span>
                    </div>
                </div>
            </div>
        </article>
    );
}
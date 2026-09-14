import React from "react";
import {
    MapPin,
    Bed,
    Bath,
    Maximize2,
    Home,
    Building,
    Sparkles,
    Calendar,
    Compass,
    Check,
} from "lucide-react";
import type { Listing } from "@/types/listing";

interface PropertyInfoProps {
    listing: Listing;
    propertyTitle: string;
    localityFormatted: string;
    formattedPrice: string;
    carpetAreaStr: string;
    furnishingStr: string;
    floorStr: string;
}

export function PropertyInfo({
    listing,
    propertyTitle,
    localityFormatted,
    formattedPrice,
    carpetAreaStr,
    furnishingStr,
    floorStr,
}: PropertyInfoProps) {
    const highlights = [
        "Spacious living room",
        "Well-ventilated rooms",
        "Modular kitchen",
        "Premium fittings",
        "Attached balconies",
        "Peaceful neighborhood",
    ];

    return (
        <div className="space-y-6">
            {/* Title & Locality */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-950">
                    {propertyTitle}
                </h1>
                <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                    <span>{localityFormatted}</span>
                </div>
            </div>

            {/* Price */}
            <div>
                <p className="text-2xl md:text-3xl font-extrabold text-gray-950">
                    {formattedPrice}
                </p>
            </div>

            {/* Quick Specs Chips */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-600">
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
                    <span>{carpetAreaStr}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Home className="h-3.5 w-3.5 text-gray-500" />
                    <span>{furnishingStr}</span>
                </div>
            </div>

            {/* Live Status & Listing ID Row */}
            <div className="flex items-center justify-between border-y border-gray-100 py-3 text-xs">
                <div className="flex items-center gap-2 font-medium text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Currently Live</span>
                </div>
                <span className="text-gray-500 font-medium">
                    Listing ID: #{listing.listing_id}
                </span>
            </div>

            {/* About this property */}
            <div className="space-y-2">
                <h2 className="text-base font-bold text-gray-900">About this property</h2>
                <p className="text-xs leading-relaxed text-gray-600">
                    {listing.description ||
                        `Spacious and well-ventilated ${propertyTitle} in the heart of ${localityFormatted}. Located in a peaceful neighborhood with excellent connectivity to markets, schools, hospitals, and public transport. Ideal for working professionals and families seeking a premium lifestyle.`}
                </p>
            </div>

            {/* Key Details Card */}
            <div className="space-y-3">
                <h2 className="text-base font-bold text-gray-900">Key details</h2>
                <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
                        {/* Property Type */}
                        <div className="flex items-start gap-2.5">
                            <Home className="h-4 w-4 text-gray-500 mt-0.5" />
                            <div>
                                <p className="text-gray-500">Property type</p>
                                <p className="font-semibold text-gray-900 capitalize">
                                    {listing.property_type || "Apartment"}
                                </p>
                            </div>
                        </div>

                        {/* Carpet Area */}
                        <div className="flex items-start gap-2.5">
                            <Maximize2 className="h-4 w-4 text-gray-500 mt-0.5" />
                            <div>
                                <p className="text-gray-500">Carpet area</p>
                                <p className="font-semibold text-gray-900">{carpetAreaStr}</p>
                            </div>
                        </div>

                        {/* Floor */}
                        <div className="flex items-start gap-2.5">
                            <Building className="h-4 w-4 text-gray-500 mt-0.5" />
                            <div>
                                <p className="text-gray-500">Floor</p>
                                <p className="font-semibold text-gray-900">{floorStr}</p>
                            </div>
                        </div>

                        {/* Furnishing */}
                        <div className="flex items-start gap-2.5">
                            <Sparkles className="h-4 w-4 text-gray-500 mt-0.5" />
                            <div>
                                <p className="text-gray-500">Furnishing</p>
                                <p className="font-semibold text-gray-900">{furnishingStr}</p>
                            </div>
                        </div>

                        {/* Available From */}
                        <div className="flex items-start gap-2.5">
                            <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                            <div>
                                <p className="text-gray-500">Available from</p>
                                <p className="font-semibold text-gray-900">15 Sep 2026</p>
                            </div>
                        </div>

                        {/* Facing Direction */}
                        <div className="flex items-start gap-2.5">
                            <Compass className="h-4 w-4 text-gray-500 mt-0.5" />
                            <div>
                                <p className="text-gray-500">Facing Direction</p>
                                <p className="font-semibold text-gray-900 capitalize">
                                    {listing.facing_direction ? `${listing.facing_direction} Facing` : "North Facing"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description & Checkmarks */}
            <div className="space-y-3">
                <h2 className="text-base font-bold text-gray-900">Description</h2>
                <p className="text-xs leading-relaxed text-gray-600">
                    This beautiful {propertyTitle} is thoughtfully designed with abundant natural sunlight and cross-ventilation. Features high-quality vitrified flooring, modern electrical fixtures, and an efficient floor layout that maximizes usable living area. Situated in a serene, secure gated community with round-the-clock facilities.
                </p>

                {/* 2-Column Checklist */}
                <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs font-medium text-gray-700">
                    {highlights.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

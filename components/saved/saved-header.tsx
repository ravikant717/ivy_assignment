"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import type { SavedSortOption } from "@/lib/hooks/use-saved-filters";

interface SavedHeaderProps {
    count: number;
    sortOption: SavedSortOption;
    onSortChange: (value: SavedSortOption) => void;
}

const SORT_OPTIONS: { label: string; value: SavedSortOption }[] = [
    { label: "Recently Saved", value: "recent" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Bedrooms: More to Less", value: "bhk_desc" },
];

export function SavedHeader({
    count,
    sortOption,
    onSortChange,
}: SavedHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3.5">
            <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900">
                    {count} saved {count === 1 ? "listing" : "listings"}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                    Properties you&apos;ve saved for later, Keep track of the ones you like.
                </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 font-medium">Sort by:</span>
                <div className="relative">
                    <select
                        value={sortOption}
                        onChange={(e) => onSortChange(e.target.value as SavedSortOption)}
                        className="appearance-none rounded-lg border border-gray-200 bg-white py-1.5 pl-3 pr-7 font-medium text-gray-800 shadow-xs transition focus:border-[#047857] focus:outline-none"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                </div>
            </div>
        </div>
    );
}

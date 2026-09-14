"use client";

import React, { useState } from "react";
import {
    Search,
    MapPin,
    Bed,
    Tag,
    Armchair,
    RotateCcw,
    X,
} from "lucide-react";
import {
    GURGAON_LOCALITIES,
    BEDROOM_OPTIONS,
    FURNISHING_OPTIONS,
    PRICE_FILTER_OPTIONS,
    type PriceFilterOption,
} from "@/lib/constants/filters";
import { FilterDropdown } from "@/components/common/filter-dropdown";

export interface FilterState {
    search: string;
    locality: string;
    bedroom: string;
    priceRange: string;
    furnishing: string;
}

interface FilterBarProps {
    filters: FilterState;
    onChange: (filters: FilterState) => void;
    onReset: () => void;
    availableLocalities?: readonly string[] | string[];
    priceOptions?: PriceFilterOption[];
}

export function FilterBar({
    filters,
    onChange,
    onReset,
    availableLocalities = GURGAON_LOCALITIES,
    priceOptions = PRICE_FILTER_OPTIONS,
}: FilterBarProps) {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const toggleDropdown = (name: string) => {
        setOpenDropdown((prev) => (prev === name ? null : name));
    };

    const hasActiveFilters =
        Boolean(filters.locality) ||
        Boolean(filters.bedroom) ||
        Boolean(filters.priceRange) ||
        Boolean(filters.furnishing) ||
        Boolean(filters.search);

    const localityOptions = availableLocalities.map((loc) => ({
        value: loc,
        label: loc,
    }));

    const bedroomOptions = BEDROOM_OPTIONS.map((bhk) => ({
        value: String(bhk),
        label: `${bhk} BHK`,
    }));

    const priceDropdownOptions = priceOptions.map((opt) => ({
        value: opt.value,
        label: opt.label,
    }));

    const furnishingDropdownOptions = FURNISHING_OPTIONS.map((f) => ({
        value: f.value,
        label: f.label,
    }));

    return (
        <div className="w-full space-y-3.5">
            {/* Search Input Bar */}
            <div className="relative flex items-center rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm transition focus-within:border-[#047857] focus-within:ring-2 focus-within:ring-[#047857]/10">
                <Search className="ml-3 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    value={filters.search}
                    onChange={(e) =>
                        onChange({ ...filters, search: e.target.value })
                    }
                    placeholder="Search locality, landmark or keyword..."
                    className="w-full bg-transparent px-3 py-1.5 text-sm text-gray-800 placeholder-gray-400 outline-none"
                />
                {filters.search && (
                    <button
                        type="button"
                        onClick={() => onChange({ ...filters, search: "" })}
                        className="mr-2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Filter Pills Row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                {/* 1. Locality Filter */}
                <FilterDropdown
                    id="locality"
                    icon={<MapPin className="h-3.5 w-3.5" />}
                    label="All Localities"
                    selectedValue={filters.locality}
                    options={localityOptions}
                    placeholder="All Localities"
                    isOpen={openDropdown === "locality"}
                    onToggle={() => toggleDropdown("locality")}
                    onChange={(val) => onChange({ ...filters, locality: val })}
                    menuWidth="w-64"
                />

                {/* 2. Bedroom Filter */}
                <FilterDropdown
                    id="bedroom"
                    icon={<Bed className="h-3.5 w-3.5" />}
                    label="Bedrooms"
                    selectedValue={filters.bedroom}
                    options={bedroomOptions}
                    placeholder="All Bedrooms"
                    isOpen={openDropdown === "bedroom"}
                    onToggle={() => toggleDropdown("bedroom")}
                    onChange={(val) => onChange({ ...filters, bedroom: val })}
                    menuWidth="w-44"
                />

                {/* 3. Price Filter */}
                <FilterDropdown
                    id="price"
                    icon={<Tag className="h-3.5 w-3.5" />}
                    label="Price Range"
                    selectedValue={filters.priceRange}
                    options={priceDropdownOptions}
                    placeholder="Any Budget"
                    isOpen={openDropdown === "price"}
                    onToggle={() => toggleDropdown("price")}
                    onChange={(val) => onChange({ ...filters, priceRange: val })}
                    menuWidth="w-56"
                />

                {/* 4. Furnishing Filter */}
                <FilterDropdown
                    id="furnishing"
                    icon={<Armchair className="h-3.5 w-3.5" />}
                    label="Furnishing"
                    selectedValue={filters.furnishing}
                    options={furnishingDropdownOptions}
                    placeholder="Any Furnishing"
                    isOpen={openDropdown === "furnishing"}
                    onToggle={() => toggleDropdown("furnishing")}
                    onChange={(val) => onChange({ ...filters, furnishing: val })}
                    menuWidth="w-48"
                />

                {/* Reset Filters Pill */}
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={onReset}
                        className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/70 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100/70 active:scale-95 shadow-2xs"
                    >
                        <RotateCcw className="h-3 w-3" />
                        <span>Reset Filters</span>
                    </button>
                )}
            </div>
        </div>
    );
}

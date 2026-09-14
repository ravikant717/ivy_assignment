"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

export interface SavedFilters {
    locality: string;
    propertyTypes: string[];
    bedrooms: string[];
    minPrice: string;
    maxPrice: string;
    furnishing: string[];
}

interface SavedFilterSidebarProps {
    filters: SavedFilters;
    onChange: (filters: SavedFilters) => void;
    onApply: () => void;
    onClearAll: () => void;
}

const PROPERTY_TYPES = [
    { label: "Apartment", value: "apartment" },
    { label: "Independent House", value: "independent house" },
    { label: "Studio", value: "studio" },
    { label: "Villa", value: "villa" },
    { label: "Penthouse", value: "penthouse" },
];

const BEDROOM_OPTIONS = [
    { label: "1 BHK", value: "1" },
    { label: "2 BHK", value: "2" },
    { label: "3 BHK", value: "3" },
    { label: "4+ BHK", value: "4" },
];

const FURNISHING_OPTIONS = [
    { label: "Fully Furnished", value: "fully furnished" },
    { label: "Semi-Furnished", value: "semi-furnished" },
    { label: "Unfurnished", value: "unfurnished" },
];

export function SavedFilterSidebar({
    filters,
    onChange,
    onApply,
    onClearAll,
}: SavedFilterSidebarProps) {
    function togglePropertyType(val: string) {
        const next = filters.propertyTypes.includes(val)
            ? filters.propertyTypes.filter((t) => t !== val)
            : [...filters.propertyTypes, val];
        onChange({ ...filters, propertyTypes: next });
    }

    function toggleBedroom(val: string) {
        const next = filters.bedrooms.includes(val)
            ? filters.bedrooms.filter((b) => b !== val)
            : [...filters.bedrooms, val];
        onChange({ ...filters, bedrooms: next });
    }

    function toggleFurnishing(val: string) {
        const next = filters.furnishing.includes(val)
            ? filters.furnishing.filter((f) => f !== val)
            : [...filters.furnishing, val];
        onChange({ ...filters, furnishing: next });
    }

    return (
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
            {/* Header: Filters & Clear all */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <button
                    type="button"
                    onClick={onClearAll}
                    className="text-xs font-medium text-gray-500 hover:text-gray-900 transition"
                >
                    Clear all
                </button>
            </div>

            {/* Locality Search */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Locality
                </label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={filters.locality}
                        onChange={(e) => onChange({ ...filters, locality: e.target.value })}
                        placeholder="Search locality, landmark..."
                        className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-xs text-gray-800 placeholder-gray-400 shadow-sm transition focus:border-[#047857] focus:outline-none focus:ring-1 focus:ring-[#047857]"
                    />
                </div>
            </div>

            {/* Property Type Checkboxes */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                    Property Type
                </label>
                <div className="space-y-2">
                    {PROPERTY_TYPES.map((type) => {
                        const isChecked = filters.propertyTypes.includes(type.value);
                        return (
                            <label
                                key={type.value}
                                className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer select-none hover:text-gray-900"
                            >
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => togglePropertyType(type.value)}
                                    className="h-4 w-4 rounded border-gray-300 text-[#047857] focus:ring-[#047857]"
                                />
                                <span>{type.label}</span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Bedrooms Checkboxes */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                    Bedrooms
                </label>
                <div className="space-y-2">
                    {BEDROOM_OPTIONS.map((bed) => {
                        const isChecked = filters.bedrooms.includes(bed.value);
                        return (
                            <label
                                key={bed.value}
                                className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer select-none hover:text-gray-900"
                            >
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleBedroom(bed.value)}
                                    className="h-4 w-4 rounded border-gray-300 text-[#047857] focus:ring-[#047857]"
                                />
                                <span>{bed.label}</span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                    Price Range (per month)
                </label>
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={filters.minPrice}
                            onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
                            placeholder="₹ Min"
                            className="w-full rounded-xl border border-gray-200 bg-white py-2 px-3 text-xs text-gray-800 placeholder-gray-400 shadow-sm transition focus:border-[#047857] focus:outline-none focus:ring-1 focus:ring-[#047857]"
                        />
                    </div>
                    <span className="text-gray-400 text-xs">-</span>
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={filters.maxPrice}
                            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
                            placeholder="₹ Max"
                            className="w-full rounded-xl border border-gray-200 bg-white py-2 px-3 text-xs text-gray-800 placeholder-gray-400 shadow-sm transition focus:border-[#047857] focus:outline-none focus:ring-1 focus:ring-[#047857]"
                        />
                    </div>
                </div>
            </div>

            {/* Furnishing Checkboxes */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                    Furnishing
                </label>
                <div className="space-y-2">
                    {FURNISHING_OPTIONS.map((fur) => {
                        const isChecked = filters.furnishing.includes(fur.value);
                        return (
                            <label
                                key={fur.value}
                                className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer select-none hover:text-gray-900"
                            >
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleFurnishing(fur.value)}
                                    className="h-4 w-4 rounded border-gray-300 text-[#047857] focus:ring-[#047857]"
                                />
                                <span>{fur.label}</span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Apply Filters Button */}
            <button
                type="button"
                onClick={onApply}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#047857] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#065f46] active:scale-[0.99]"
            >
                <SlidersHorizontal className="h-4 w-4" />
                Apply Filters
            </button>
        </aside>
    );
}

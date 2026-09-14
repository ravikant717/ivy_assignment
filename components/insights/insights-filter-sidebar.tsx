"use client";

import React from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import type { InsightsFilters } from "@/lib/hooks/use-insights-data";

interface InsightsFilterSidebarProps {
    filters: InsightsFilters;
    onChange: (filters: InsightsFilters) => void;
    onApply: () => void;
    onClearAll: () => void;
}

const PROPERTY_TYPES = [
    { label: "Apartment", value: "apartment" },
    { label: "Builder Floor", value: "builder floor" },
    { label: "Independent House", value: "independent house" },
    { label: "Villa", value: "villa" },
    { label: "Plot", value: "plot" },
];

const BEDROOM_OPTIONS = [
    { label: "1 BHK", value: "1" },
    { label: "2 BHK", value: "2" },
    { label: "3 BHK", value: "3" },
    { label: "4 BHK", value: "4" },
    { label: "5+ BHK", value: "5" },
];

const TIME_RANGES = [
    "Last 3 months",
    "Last 6 months",
    "Last 1 year",
    "All Time",
];

export function InsightsFilterSidebar({
    filters,
    onChange,
    onApply,
    onClearAll,
}: InsightsFilterSidebarProps) {
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

    return (
        <aside className="w-full lg:w-60 xl:w-64 shrink-0 space-y-6">
            {/* Header */}
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

            {/* Location Search */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Location
                </label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={filters.location}
                        onChange={(e) => onChange({ ...filters, location: e.target.value })}
                        placeholder="Search locality, city..."
                        className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-xs text-gray-800 placeholder-gray-400 shadow-xs transition focus:border-[#047857] focus:outline-none focus:ring-1 focus:ring-[#047857]"
                    />
                </div>
            </div>

            {/* Property Type */}
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

            {/* Bedrooms */}
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

            {/* Time Range Dropdown */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Time Range
                </label>
                <div className="relative">
                    <select
                        value={filters.timeRange}
                        onChange={(e) => onChange({ ...filters, timeRange: e.target.value })}
                        className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2 pl-3 pr-8 text-xs font-medium text-gray-800 shadow-xs transition focus:border-[#047857] focus:outline-none"
                    >
                        {TIME_RANGES.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                </div>
            </div>

            {/* Apply Button */}
            <button
                type="button"
                onClick={onApply}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#047857] py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-[#065f46] active:scale-[0.99]"
            >
                <SlidersHorizontal className="h-4 w-4" />
                Apply Filters
            </button>
        </aside>
    );
}

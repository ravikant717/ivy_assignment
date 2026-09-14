"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Search,
    MapPin,
    Bed,
    Tag,
    Armchair,
    ChevronDown,
    X,
} from "lucide-react";
import {
    GURGAON_LOCALITIES,
    BEDROOM_OPTIONS,
    FURNISHING_OPTIONS,
    PRICE_FILTER_OPTIONS,
} from "@/lib/constants/filters";

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
}

export function FilterBar({
    filters,
    onChange,
    onReset,
    availableLocalities = GURGAON_LOCALITIES,
}: FilterBarProps) {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close popover when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpenDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const hasActiveFilters =
        filters.locality !== "" ||
        filters.bedroom !== "" ||
        filters.priceRange !== "" ||
        filters.furnishing !== "" ||
        filters.search !== "";

    const selectedPriceLabel =
        PRICE_FILTER_OPTIONS.find((p) => p.value === filters.priceRange)?.label ||
        "Price Range";

    return (
        <div ref={containerRef} className="w-full space-y-3.5">
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
                <button
                    type="button"
                    aria-label="Search"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#047857] text-white transition hover:bg-[#065f46]"
                >
                    <Search className="h-4 w-4" />
                </button>
            </div>

            {/* Filter Pills Row */}
            <div className="flex flex-wrap items-center gap-2.5">
                {/* Locality Dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => toggleDropdown("locality")}
                        className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition ${
                            filters.locality
                                ? "border-[#047857] bg-emerald-50/60 text-[#047857]"
                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <MapPin className="h-3.5 w-3.5 text-gray-500" />
                        <span>{filters.locality || "Locality"}</span>
                        <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                    </button>

                    {openDropdown === "locality" && (
                        <div className="absolute left-0 top-full z-30 mt-1.5 w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
                            <button
                                type="button"
                                onClick={() => {
                                    onChange({ ...filters, locality: "" });
                                    setOpenDropdown(null);
                                }}
                                className={`w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium transition ${
                                    !filters.locality
                                        ? "bg-emerald-50 text-[#047857]"
                                        : "text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                All Localities
                            </button>
                            {availableLocalities.map((loc) => (
                                <button
                                    key={loc}
                                    type="button"
                                    onClick={() => {
                                        onChange({ ...filters, locality: loc });
                                        setOpenDropdown(null);
                                    }}
                                    className={`w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium transition ${
                                        filters.locality.toLowerCase() ===
                                        loc.toLowerCase()
                                            ? "bg-emerald-50 text-[#047857]"
                                            : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    {loc}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bedrooms Dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => toggleDropdown("bedroom")}
                        className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition ${
                            filters.bedroom
                                ? "border-[#047857] bg-emerald-50/60 text-[#047857]"
                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <Bed className="h-3.5 w-3.5 text-gray-500" />
                        <span>
                            {filters.bedroom ? `${filters.bedroom} BHK` : "Bedrooms"}
                        </span>
                        <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                    </button>

                    {openDropdown === "bedroom" && (
                        <div className="absolute left-0 top-full z-30 mt-1.5 w-44 rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
                            <button
                                type="button"
                                onClick={() => {
                                    onChange({ ...filters, bedroom: "" });
                                    setOpenDropdown(null);
                                }}
                                className={`w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium transition ${
                                    !filters.bedroom
                                        ? "bg-emerald-50 text-[#047857]"
                                        : "text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                Any Bedrooms
                            </button>
                            {BEDROOM_OPTIONS.map((bhk) => (
                                <button
                                    key={bhk}
                                    type="button"
                                    onClick={() => {
                                        onChange({ ...filters, bedroom: bhk });
                                        setOpenDropdown(null);
                                    }}
                                    className={`w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium transition ${
                                        filters.bedroom === bhk
                                            ? "bg-emerald-50 text-[#047857]"
                                            : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    {bhk} BHK
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Price Range Dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => toggleDropdown("priceRange")}
                        className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition ${
                            filters.priceRange
                                ? "border-[#047857] bg-emerald-50/60 text-[#047857]"
                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <Tag className="h-3.5 w-3.5 text-gray-500" />
                        <span>{selectedPriceLabel}</span>
                        <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                    </button>

                    {openDropdown === "priceRange" && (
                        <div className="absolute left-0 top-full z-30 mt-1.5 w-52 rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
                            {PRICE_FILTER_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                        onChange({ ...filters, priceRange: opt.value });
                                        setOpenDropdown(null);
                                    }}
                                    className={`w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium transition ${
                                        filters.priceRange === opt.value
                                            ? "bg-emerald-50 text-[#047857]"
                                            : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Furnishing Dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => toggleDropdown("furnishing")}
                        className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition ${
                            filters.furnishing
                                ? "border-[#047857] bg-emerald-50/60 text-[#047857]"
                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <Armchair className="h-3.5 w-3.5 text-gray-500" />
                        <span className="capitalize">
                            {filters.furnishing || "Furnishing"}
                        </span>
                        <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                    </button>

                    {openDropdown === "furnishing" && (
                        <div className="absolute left-0 top-full z-30 mt-1.5 w-48 rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
                            {FURNISHING_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                        onChange({ ...filters, furnishing: opt.value });
                                        setOpenDropdown(null);
                                    }}
                                    className={`w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium transition ${
                                        filters.furnishing === opt.value
                                            ? "bg-emerald-50 text-[#047857]"
                                            : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Clear all button */}
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={onReset}
                        className="text-xs font-medium text-gray-500 underline-offset-4 transition hover:text-[#047857] hover:underline"
                    >
                        Clear all
                    </button>
                )}
            </div>
        </div>
    );
}

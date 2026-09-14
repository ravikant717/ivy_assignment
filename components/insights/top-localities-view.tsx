"use client";

import React, { useState, useMemo } from "react";
import {
    MapPin,
    ArrowUpRight,
    Search,
    SlidersHorizontal,
    TrendingUp,
    Percent,
    Building,
    DollarSign,
} from "lucide-react";
import type { LocalityInsight } from "@/lib/insights-data";

interface TopLocalitiesViewProps {
    localities: LocalityInsight[];
    selectedLocality?: string | null;
    onSelectLocality?: (loc: string) => void;
}

type SortField = "demand" | "price_sqft" | "yield" | "growth" | "units";

export function TopLocalitiesView({
    localities,
    selectedLocality,
    onSelectLocality,
}: TopLocalitiesViewProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortField>("demand");

    // Filter and Sort localities
    const processedLocalities = useMemo(() => {
        let list = [...localities];

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            list = list.filter(
                (l) =>
                    l.locality.toLowerCase().includes(q) ||
                    l.display_name.toLowerCase().includes(q)
            );
        }

        list.sort((a, b) => {
            if (sortBy === "demand") {
                return (b.searches_num || 0) - (a.searches_num || 0);
            }
            if (sortBy === "price_sqft") {
                return b.price_sqft - a.price_sqft;
            }
            if (sortBy === "yield") {
                return (b.rental_yield || 0) - (a.rental_yield || 0);
            }
            if (sortBy === "growth") {
                return b.growth - a.growth;
            }
            if (sortBy === "units") {
                return (b.total_units || b.count) - (a.total_units || a.count);
            }
            return 0;
        });

        return list;
    }, [localities, searchQuery, sortBy]);

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs space-y-5">
            {/* Header with Search & Sort controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div>
                    <h3 className="text-base font-bold text-gray-900">
                        Top Localities Market Intelligence
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                        In-depth comparative analysis across all 10 Gurgaon micro-markets.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Search Locality input */}
                    <div className="relative w-44 sm:w-52">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search locality..."
                            className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-1.5 pl-8 pr-3 text-xs text-gray-800 placeholder-gray-400 focus:border-[#047857] focus:bg-white focus:outline-none"
                        />
                    </div>

                    {/* Sort Selector */}
                    <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-gray-400 font-medium">Sort:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortField)}
                            className="rounded-lg border border-gray-200 bg-white py-1.5 px-2.5 text-xs font-semibold text-gray-800 focus:border-[#047857] focus:outline-none cursor-pointer"
                        >
                            <option value="demand">By Demand (Searches)</option>
                            <option value="price_sqft">By Rate (₹/sq ft)</option>
                            <option value="yield">By Rental Yield (%)</option>
                            <option value="growth">By YoY Growth (%)</option>
                            <option value="units">By Total Inventory</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Localities Comparison Table / Cards */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50/80 text-[11px] font-semibold text-gray-500">
                            <th className="py-2.5 px-3">Rank & Locality</th>
                            <th className="py-2.5 px-3">Inventory (Supply)</th>
                            <th className="py-2.5 px-3">Median Buy Price</th>
                            <th className="py-2.5 px-3">Price / sq ft</th>
                            <th className="py-2.5 px-3">Average Rent</th>
                            <th className="py-2.5 px-3">Rental Yield</th>
                            <th className="py-2.5 px-3">Search Demand</th>
                            <th className="py-2.5 px-3 text-right">YoY Growth</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-sans">
                        {processedLocalities.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="py-6 text-center text-xs text-gray-400">
                                    No localities match &quot;{searchQuery}&quot;
                                </td>
                            </tr>
                        ) : (
                            processedLocalities.map((loc, idx) => {
                                const isSelected = selectedLocality === loc.locality;
                                const medCr = (loc.median_price / 10000000).toFixed(2);
                                const totalUnits = loc.total_units || loc.count;

                                return (
                                    <tr
                                        key={loc.locality}
                                        onClick={() => onSelectLocality?.(loc.locality)}
                                        className={`transition-colors cursor-pointer ${
                                            isSelected
                                                ? "bg-emerald-50/70 font-semibold"
                                                : "hover:bg-gray-50/80"
                                        }`}
                                    >
                                        {/* Rank + Name */}
                                        <td className="py-3 px-3">
                                            <div className="flex items-center gap-2">
                                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-[10px] font-bold text-[#047857]">
                                                    {idx + 1}
                                                </span>
                                                <div className="flex items-center gap-1 font-bold text-gray-900">
                                                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                                                    <span>{loc.display_name}</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Supply Inventory */}
                                        <td className="py-3 px-3">
                                            <span className="font-semibold text-gray-800">
                                                {totalUnits} units
                                            </span>
                                            <span className="block text-[10px] text-gray-400 font-normal">
                                                {loc.count} buy · {loc.rent_count || 120} rent
                                            </span>
                                        </td>

                                        {/* Median Buy Price */}
                                        <td className="py-3 px-3 font-semibold text-gray-900">
                                            ₹ {medCr} Cr
                                        </td>

                                        {/* Price / sq ft */}
                                        <td className="py-3 px-3 font-extrabold text-[#047857]">
                                            {loc.price_label}
                                        </td>

                                        {/* Average Rent */}
                                        <td className="py-3 px-3 font-medium text-gray-700">
                                            ₹ {(loc.average_rent || 34000).toLocaleString("en-IN")}/mo
                                        </td>

                                        {/* Rental Yield */}
                                        <td className="py-3 px-3">
                                            <span className="inline-flex items-center rounded-full bg-emerald-100/90 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                                                {loc.rental_yield || 2.9}%
                                            </span>
                                        </td>

                                        {/* Demand Searches */}
                                        <td className="py-3 px-3 font-medium text-gray-700">
                                            {loc.searches}
                                        </td>

                                        {/* YoY Growth */}
                                        <td className="py-3 px-3 text-right">
                                            <span className="font-bold text-emerald-600">
                                                ↑ {loc.growth}%
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

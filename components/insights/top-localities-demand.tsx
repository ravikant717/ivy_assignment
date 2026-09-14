"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { LocalityInsight } from "@/lib/insights-data";

interface TopLocalitiesDemandProps {
    localities: LocalityInsight[];
    selectedLocality?: string | null;
    onSelectLocality?: (loc: string) => void;
    onViewAll?: () => void;
}

export function TopLocalitiesDemand({
    localities,
    selectedLocality,
    onSelectLocality,
    onViewAll,
}: TopLocalitiesDemandProps) {
    const topFive = localities.slice(0, 5);

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs flex flex-col justify-between">
            {/* Header */}
            <div>
                <h3 className="text-base font-bold text-gray-900">
                    Top Localities by Demand
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                    Based on user searches and views in Gurgaon.
                </p>
            </div>

            {/* List */}
            <div className="space-y-1.5 py-3">
                {topFive.length === 0 ? (
                    <p className="text-xs text-gray-400 py-4 text-center">
                        No localities match the selected filter.
                    </p>
                ) : (
                    topFive.map((loc, idx) => {
                        const isSelected = selectedLocality === loc.locality;
                        return (
                            <button
                                key={loc.locality}
                                type="button"
                                onClick={() => onSelectLocality?.(loc.locality)}
                                className={`w-full flex items-center justify-between gap-3 text-xs p-2 rounded-xl transition-all text-left ${
                                    isSelected
                                        ? "bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-xs"
                                        : "hover:bg-gray-50 text-gray-800"
                                }`}
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    {/* Rank Badge */}
                                    <span
                                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold ${
                                            isSelected
                                                ? "bg-[#047857] text-white"
                                                : "bg-emerald-50 text-[#047857]"
                                        }`}
                                    >
                                        {idx + 1}
                                    </span>
                                    <div className="min-w-0">
                                        <span className="font-semibold text-gray-900 truncate block">
                                            {loc.display_name}
                                        </span>
                                        <span className="text-[11px] text-gray-500 font-normal">
                                            {loc.count} listings · ₹ {(loc.median_price / 10000000).toFixed(2)} Cr
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end shrink-0">
                                    <span className="flex items-center text-emerald-600 font-bold text-xs">
                                        ↑ {loc.growth}%
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-medium">
                                        {loc.searches}
                                    </span>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>

            {/* Footer Link */}
            <div className="pt-2 border-t border-gray-50">
                {onViewAll ? (
                    <button
                        type="button"
                        onClick={onViewAll}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#047857] hover:underline transition cursor-pointer"
                    >
                        <span>View all localities (Full Matrix)</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                ) : (
                    <Link
                        href="/listings"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#047857] hover:underline transition"
                    >
                        <span>View all localities</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                )}
            </div>
        </div>
    );
}

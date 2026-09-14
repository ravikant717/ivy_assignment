"use client";

import React from "react";
import { Bed } from "lucide-react";
import type { BhkDistribution as BhkItem } from "@/lib/insights-data";

interface BhkDistributionProps {
    items?: BhkItem[];
    totalListings: number;
    city?: string;
}

export function BhkDistribution({
    items = [],
    totalListings,
    city = "Gurgaon",
}: BhkDistributionProps) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs flex flex-col justify-between">
            {/* Header */}
            <div>
                <h3 className="text-base font-bold text-gray-900">
                    BHK Configuration Breakdown
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                    Listing availability by bedroom count in {city}.
                </p>
            </div>

            {/* List with Visual Progress Bars */}
            <div className="space-y-3 py-3">
                {items.map((item) => (
                    <div key={item.bedroom} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                                <Bed className="h-3.5 w-3.5 text-[#047857]" />
                                <span>{item.label || `${item.bedroom} BHK`}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900">
                                    {item.count.toLocaleString("en-IN")} listings
                                </span>
                                <span className="text-[11px] text-gray-400 font-medium">
                                    ({item.percentage}%)
                                </span>
                            </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-[#047857] transition-all duration-500"
                                style={{ width: `${Math.min(item.percentage, 100)}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Summary */}
            <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                <span>Total Cataloged</span>
                <span className="font-bold text-gray-900">
                    {totalListings.toLocaleString("en-IN")} listings
                </span>
            </div>
        </div>
    );
}

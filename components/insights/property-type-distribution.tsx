"use client";

import React from "react";
import type { PropertyTypeDistribution as PropTypeItem } from "@/lib/insights-data";

interface PropertyTypeDistributionProps {
    items: PropTypeItem[];
    totalListings: number;
    city?: string;
}

export function PropertyTypeDistribution({
    items,
    totalListings,
    city = "Gurgaon",
}: PropertyTypeDistributionProps) {
    // Donut chart math
    const radius = 50;
    const strokeWidth = 14;
    const circumference = 2 * Math.PI * radius;

    let accumulatedPct = 0;
    const segments = items.map((item) => {
        const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
        const strokeDashoffset = -((accumulatedPct / 100) * circumference);
        accumulatedPct += item.percentage;
        return {
            ...item,
            strokeDasharray,
            strokeDashoffset,
        };
    });

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs flex flex-col justify-between">
            {/* Header */}
            <div>
                <h3 className="text-base font-bold text-gray-900">
                    Property Type Distribution
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                    Share of total listings in {city}.
                </p>
            </div>

            {/* Content: Donut + Legend */}
            <div className="flex items-center justify-between gap-6 py-4">
                {/* SVG Donut */}
                <div className="relative flex items-center justify-center shrink-0">
                    <svg
                        width="135"
                        height="135"
                        viewBox="0 0 135 135"
                        className="-rotate-90"
                    >
                        {/* Background track */}
                        <circle
                            cx="67.5"
                            cy="67.5"
                            r={radius}
                            fill="transparent"
                            stroke="#f1f5f9"
                            strokeWidth={strokeWidth}
                        />

                        {/* Segment arcs */}
                        {segments.map((seg, idx) => (
                            <circle
                                key={idx}
                                cx="67.5"
                                cy="67.5"
                                r={radius}
                                fill="transparent"
                                stroke={seg.color}
                                strokeWidth={strokeWidth}
                                strokeDasharray={seg.strokeDasharray}
                                strokeDashoffset={seg.strokeDashoffset}
                                strokeLinecap="butt"
                                className="transition-all duration-300"
                            />
                        ))}
                    </svg>

                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-sm font-extrabold text-gray-950 leading-tight">
                            {totalListings.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                            Listings
                        </span>
                    </div>
                </div>

                {/* Right Legend */}
                <div className="flex-1 space-y-2">
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between text-xs text-gray-600"
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className="h-2.5 w-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="font-medium text-gray-700 truncate max-w-[110px]">
                                    {item.type}
                                </span>
                            </div>
                            <span className="font-bold text-gray-900 ml-2">
                                {item.percentage}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

"use client";

import React from "react";
import { MapPin } from "lucide-react";

interface InsightsHeaderProps {
    city: string;
    onCityChange: (city: string) => void;
}

export function InsightsHeader({ city, onCityChange }: InsightsHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    Market Insights
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Get data-driven insights about real estate trends, pricing and demand across different localities.
                </p>
            </div>

            {/* Grounded City Badge */}
            <div className="relative shrink-0">
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3.5 py-2 text-sm font-semibold text-[#047857] shadow-xs">
                    <MapPin className="h-4 w-4 text-[#047857]" />
                    <span>Gurgaon</span>
                    <span className="hidden sm:inline-block rounded-full bg-[#047857] px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide">
                        API Grounded
                    </span>
                </div>
            </div>
        </div>
    );
}

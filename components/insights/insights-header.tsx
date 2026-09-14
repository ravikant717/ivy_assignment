"use client";

import React from "react";
import { MapPin, Clock } from "lucide-react";

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

            {/* Grounded City & Reference Moment Badges */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-2xs">
                    <Clock className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Reference: 10 Sep 2026, 00:00 IST</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3.5 py-2 text-sm font-semibold text-[#047857] shadow-xs">
                    <MapPin className="h-4 w-4 text-[#047857]" />
                    <span>Gurgaon</span>
                </div>
            </div>
        </div>
    );
}

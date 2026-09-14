"use client";

import React from "react";
import { Home, Key, BarChart3, Users2, ArrowUpRight } from "lucide-react";
import type { AnalyticsSummary } from "@/lib/insights-data";

interface InsightsKpiCardsProps {
    data: AnalyticsSummary;
}

export function InsightsKpiCards({ data }: InsightsKpiCardsProps) {
    const cards = [
        {
            label: "Average Price (Buy)",
            value: `₹ ${data.average_price_sqft.toLocaleString("en-IN")} / sq ft`,
            trend: `↑ ${data.price_growth_pct}%`,
            period: "vs last 6 months",
            icon: Home,
            iconBg: "bg-emerald-50 text-[#047857]",
        },
        {
            label: "Average Rent",
            value: `₹ ${data.average_rent.toLocaleString("en-IN")} / month`,
            trend: `↑ ${data.rent_growth_pct}%`,
            period: "vs last 6 months",
            icon: Key,
            iconBg: "bg-blue-50 text-blue-600",
        },
        {
            label: "Total Listings",
            value: data.total_listings.toLocaleString("en-IN"),
            trend: `↑ ${data.total_listings_growth_pct}%`,
            period: "vs last 6 months",
            icon: BarChart3,
            iconBg: "bg-teal-50 text-teal-600",
        },
        {
            label: "Rental Yield",
            value: `${data.rental_yield}%`,
            trend: `↑ ${data.rental_yield_growth_pct}%`,
            period: "vs last 6 months",
            icon: Users2,
            iconBg: "bg-emerald-50 text-emerald-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, idx) => {
                const IconComponent = card.icon;
                return (
                    <div
                        key={idx}
                        className="flex items-start gap-3.5 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs transition hover:shadow-sm"
                    >
                        <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.iconBg}`}
                        >
                            <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs text-gray-500 font-medium">{card.label}</p>
                            <p className="mt-1 text-lg font-bold tracking-tight text-gray-900 truncate">
                                {card.value}
                            </p>
                            <div className="mt-1.5 flex items-center gap-1 text-[11px]">
                                <span className="font-semibold text-emerald-600">
                                    {card.trend}
                                </span>
                                <span className="text-gray-400">{card.period}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

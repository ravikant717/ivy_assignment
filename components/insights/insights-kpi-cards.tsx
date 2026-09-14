"use client";

import React from "react";
import { Home, Key, BarChart3, Users2, TrendingUp } from "lucide-react";
import type { AnalyticsSummary } from "@/lib/insights-data";

interface InsightsKpiCardsProps {
    data: AnalyticsSummary;
}

export function InsightsKpiCards({ data }: InsightsKpiCardsProps) {
    const medCr = data.median_price
        ? (data.median_price / 10000000).toFixed(2)
        : "1.47";
    const medSqft =
        data.median_price_per_sqft ||
        Math.round(data.average_price_sqft * 0.55);

    const cards = [
        {
            label: "Median Buy Price",
            value: `₹ ${medCr} Cr`,
            subtext: `₹ ${medSqft.toLocaleString("en-IN")} / sq ft median rate`,
            trend: `↑ ${data.price_growth_pct}%`,
            period: "vs last 6 mo",
            icon: Home,
            iconBg: "bg-emerald-50 text-[#047857]",
        },
        {
            label: "Total Listings",
            value: data.total_listings.toLocaleString("en-IN"),
            subtext: "Live cataloged inventory",
            trend: `↑ ${data.total_listings_growth_pct}%`,
            period: "vs last 6 mo",
            icon: BarChart3,
            iconBg: "bg-teal-50 text-teal-600",
        },
        {
            label: "Average Monthly Rent",
            value: `₹ ${data.average_rent.toLocaleString("en-IN")}`,
            subtext: "Rental market average",
            trend: `↑ ${data.rent_growth_pct}%`,
            period: "vs last 6 mo",
            icon: Key,
            iconBg: "bg-blue-50 text-blue-600",
        },
        {
            label: "Gross Rental Yield",
            value: `${data.rental_yield}%`,
            subtext: "Annualized return",
            trend: `↑ ${data.rental_yield_growth_pct}%`,
            period: "vs last 6 mo",
            icon: Users2,
            iconBg: "bg-purple-50 text-purple-600",
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
                            <p className="text-[11px] font-medium text-gray-600 truncate mt-0.5">
                                {card.subtext}
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

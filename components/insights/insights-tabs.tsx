"use client";

import React from "react";
import type { InsightsTab } from "@/lib/hooks/use-insights-data";

interface InsightsTabsProps {
    activeTab: InsightsTab;
    onTabChange: (tab: InsightsTab) => void;
}

const TABS: InsightsTab[] = [
    "Price Trends",
    "Rental Trends",
    "Demand & Supply",
    "Top Localities",
];

export function InsightsTabs({ activeTab, onTabChange }: InsightsTabsProps) {
    return (
        <div className="flex items-center gap-6 border-b border-gray-200">
            {TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => onTabChange(tab)}
                        className={`relative pb-3 text-sm transition ${
                            isActive
                                ? "font-bold text-[#047857]"
                                : "font-medium text-gray-500 hover:text-gray-900"
                        }`}
                    >
                        {tab}
                        {isActive && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#047857]" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}

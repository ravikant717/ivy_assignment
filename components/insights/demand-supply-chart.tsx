"use client";

import React, { useState } from "react";
import { TrendingUp, Users, Home, AlertCircle, ArrowUpRight } from "lucide-react";
import type { DemandSupplyTrend, DemandByBhk } from "@/lib/insights-data";

interface DemandSupplyChartProps {
    trends?: DemandSupplyTrend[];
    bhkDemand?: DemandByBhk[];
}

export function DemandSupplyChart({ trends = [], bhkDemand = [] }: DemandSupplyChartProps) {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    const maxVal = Math.max(
        ...trends.flatMap((t) => [t.demand, t.supply]),
        1000
    );

    // Default to May (idx 4) or hovered index
    const activeItem = hoveredIdx !== null ? trends[hoveredIdx] : trends[4] || trends[trends.length - 1];

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div>
                    <h3 className="text-base font-bold text-gray-900">
                        Demand & Supply Market Dynamics
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Empirical comparison of buyer search velocity against active listing inventory in Gurgaon.
                    </p>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded-sm bg-[#047857]" />
                        <span className="text-gray-700">Buyer Search Demand</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded-sm bg-indigo-500" />
                        <span className="text-gray-700">Active Supply Inventory</span>
                    </div>
                </div>
            </div>

            {/* Quick KPIs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                    <p className="text-[11px] font-medium text-emerald-800">Market Absorption Ratio</p>
                    <p className="text-lg font-extrabold text-emerald-950 mt-1">1.82x</p>
                    <p className="text-[10px] text-emerald-700 mt-0.5">Demand outpaces supply</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3">
                    <p className="text-[11px] font-medium text-gray-500">Avg Market Clearance</p>
                    <p className="text-lg font-extrabold text-gray-950 mt-1">34 Days</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Listing to closing velocity</p>
                </div>
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
                    <p className="text-[11px] font-medium text-indigo-800">Peak Demand Window</p>
                    <p className="text-lg font-extrabold text-indigo-950 mt-1">May – Jul 2026</p>
                    <p className="text-[10px] text-indigo-700 mt-0.5">890 inquiries / month</p>
                </div>
                <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3">
                    <p className="text-[11px] font-medium text-amber-800">Highest Deficit</p>
                    <p className="text-lg font-extrabold text-amber-950 mt-1">2 & 3 BHK Units</p>
                    <p className="text-[10px] text-amber-700 mt-0.5">1.9x demand-supply gap</p>
                </div>
            </div>

            {/* Dual Bar Comparison Graph */}
            <div className="pt-2">
                <div className="relative flex items-end justify-between gap-2 sm:gap-4 h-52 pt-6 px-2 border-b border-gray-200">
                    {trends.map((item, idx) => {
                        const demandHeight = Math.round((item.demand / maxVal) * 160);
                        const supplyHeight = Math.round((item.supply / maxVal) * 160);
                        const isHovered = hoveredIdx === idx;

                        return (
                            <div
                                key={item.month}
                                onMouseEnter={() => setHoveredIdx(idx)}
                                onMouseLeave={() => setHoveredIdx(null)}
                                className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
                            >
                                {/* Ratio Badge above bars */}
                                <span className={`text-[10px] font-bold mb-1.5 transition-all ${
                                    isHovered ? "scale-110 text-emerald-700" : "text-gray-400"
                                }`}>
                                    {item.ratio}x
                                </span>

                                {/* Dual Bars */}
                                <div className="flex items-end gap-1 w-full max-w-[36px] justify-center">
                                    {/* Demand Bar */}
                                    <div
                                        style={{ height: `${demandHeight}px` }}
                                        className={`w-3 sm:w-4 rounded-t-md transition-all duration-200 ${
                                            isHovered
                                                ? "bg-[#047857] shadow-md shadow-emerald-700/20"
                                                : "bg-[#047857]/85 hover:bg-[#047857]"
                                        }`}
                                    />
                                    {/* Supply Bar */}
                                    <div
                                        style={{ height: `${supplyHeight}px` }}
                                        className={`w-3 sm:w-4 rounded-t-md transition-all duration-200 ${
                                            isHovered
                                                ? "bg-indigo-600 shadow-md shadow-indigo-600/20"
                                                : "bg-indigo-400/80 hover:bg-indigo-500"
                                        }`}
                                    />
                                </div>

                                {/* X-axis month label */}
                                <span className={`mt-2 text-[11px] font-semibold transition-colors ${
                                    isHovered ? "text-[#047857]" : "text-gray-500"
                                }`}>
                                    {item.month}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Active Tooltip Details Banner */}
                {activeItem && (
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-50/90 px-4 py-2.5 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">{activeItem.label}:</span>
                            <span className="text-[#047857] font-bold">{activeItem.demand.toLocaleString()} Inquiries</span>
                            <span>vs</span>
                            <span className="text-indigo-600 font-bold">{activeItem.supply.toLocaleString()} Listed Units</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">Market Pressure:</span>
                            <span className="font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full text-[11px]">
                                {activeItem.ratio}x Demand Ratio
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* BHK Demand vs Supply Absorption Grid */}
            <div className="pt-2 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">
                    BHK Inventory Absorption & Deficit Analysis
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {bhkDemand.map((bhk) => (
                        <div
                            key={bhk.label}
                            className="rounded-xl border border-gray-100 bg-gray-50/60 p-3 flex flex-col justify-between"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-gray-900 text-xs">{bhk.label}</span>
                                <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                        bhk.status === "High Deficit"
                                            ? "bg-rose-100 text-rose-700"
                                            : bhk.status === "Surplus"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-emerald-100 text-emerald-800"
                                    }`}
                                >
                                    {bhk.status}
                                </span>
                            </div>

                            {/* Comparison bars */}
                            <div className="mt-3 space-y-1.5 text-[11px]">
                                <div className="flex items-center justify-between text-gray-600">
                                    <span>Demand Share:</span>
                                    <strong className="text-emerald-700">{bhk.demandPct}%</strong>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                                    <div
                                        style={{ width: `${bhk.demandPct * 2}%` }}
                                        className="h-full bg-[#047857] rounded-full"
                                    />
                                </div>

                                <div className="flex items-center justify-between text-gray-600 pt-1">
                                    <span>Supply Share:</span>
                                    <strong className="text-indigo-700">{bhk.supplyPct}%</strong>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                                    <div
                                        style={{ width: `${bhk.supplyPct * 2}%` }}
                                        className="h-full bg-indigo-500 rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

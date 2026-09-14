"use client";

import React, { useState } from "react";
import {
    ShieldCheck,
    AlertTriangle,
    Building2,
    TrendingUp,
    Sparkles,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Info,
    Database,
} from "lucide-react";
import type { DataDiscoveries } from "@/lib/insights-data";

interface InsightsDiscoveriesCardProps {
    discoveries?: DataDiscoveries;
    city: string;
}

export function InsightsDiscoveriesCard({ discoveries, city }: InsightsDiscoveriesCardProps) {
    const [isAuditExpanded, setIsAuditExpanded] = useState(false);

    if (!discoveries) return null;

    return (
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40 p-5 shadow-xs">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-100/60">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#047857] text-white shadow-xs">
                        <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-gray-900">
                                Key Data Discoveries & Raw Files Integrity Audit
                            </h3>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/90 px-2 py-0.5 text-[10px] font-bold text-[#047857]">
                                <Database className="h-2.5 w-2.5" />
                                100% Grounded
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                                ⚓ Reference: 2026-09-10T00:00:00+05:30 (IST)
                            </span>
                        </div>
                        <p className="text-[11px] text-gray-500">
                            Empirical analysis grounded directly in {city} raw files (3,500 listings, 1,320 rentals, 400 projects) anchored to fixed reference moment.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsAuditExpanded(!isAuditExpanded)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-[#047857] hover:bg-emerald-50 transition-colors cursor-pointer"
                    >
                        <span>{isAuditExpanded ? "Hide Audit Details" : "View Corrupt & Discrepancy Records"}</span>
                        {isAuditExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                </div>
            </div>

            {/* Grid of 4 Key Discoveries */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* 1. Live vs Inactive Ratio */}
                <div className="rounded-xl border border-gray-100 bg-white/95 p-3.5 shadow-2xs">
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span>Platform Live Rate</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-normal">Active</span>
                    </div>
                    <p className="mt-2 text-xl font-extrabold text-gray-950">
                        {discoveries.livePct}%
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                        <strong className="text-gray-700">{discoveries.liveCount.toLocaleString()}</strong> live · {discoveries.inactiveCount.toLocaleString()} inactive
                    </p>
                </div>

                {/* 2. Verification Integrity */}
                <div className="rounded-xl border border-gray-100 bg-white/95 p-3.5 shadow-2xs">
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck className="h-4 w-4 text-[#047857]" />
                            <span>Verified Listings</span>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-medium">Audited</span>
                    </div>
                    <p className="mt-2 text-xl font-extrabold text-gray-950">
                        {discoveries.verifiedPct}%
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                        <strong className="text-gray-700">{discoveries.verifiedCount.toLocaleString()}</strong> officially verified in raw data
                    </p>
                </div>

                {/* 3. Corrupt Data Audit (Question 4) */}
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 shadow-2xs">
                    <div className="flex items-center justify-between text-xs font-semibold text-amber-900">
                        <div className="flex items-center gap-1.5">
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            <span>Corrupt Records Flagged</span>
                        </div>
                        <span className="rounded bg-amber-200/80 px-1.5 py-0.2 text-[9px] font-bold text-amber-900">Anomaly</span>
                    </div>
                    <p className="mt-2 text-xl font-extrabold text-amber-950">
                        {discoveries.corruptCount} listings
                    </p>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                        6 negative prices · 6 floor &gt; total_floors
                    </p>
                </div>

                {/* 4. Project Discrepancy Rate (Question 10) */}
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3.5 shadow-2xs">
                    <div className="flex items-center justify-between text-xs font-semibold text-indigo-900">
                        <div className="flex items-center gap-1.5">
                            <Building2 className="h-4 w-4 text-indigo-600" />
                            <span>Project Mismatch</span>
                        </div>
                        <span className="text-[10px] text-indigo-600 font-medium">Inventory</span>
                    </div>
                    <p className="mt-2 text-xl font-extrabold text-indigo-950">
                        {discoveries.projectsDiscrepancyPct}%
                    </p>
                    <p className="text-[11px] text-indigo-700 mt-0.5">
                        <strong className="text-indigo-900">{discoveries.projectsWithDiscrepancy}</strong> of {discoveries.projectsTotal} projects report wrong counts
                    </p>
                </div>
            </div>

            {/* Expandable Detailed Audit Drawer */}
            {isAuditExpanded && (
                <div className="mt-4 rounded-xl border border-emerald-200/80 bg-white p-4 transition-all">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                            <Info className="h-3.5 w-3.5 text-[#047857]" />
                            Grounded Data Health & Anomaly Drilldown
                        </h4>
                        <span className="text-[11px] text-gray-500">
                            Costliest Project: <strong className="text-gray-900">{discoveries.costliestProject.name}</strong> (₹ {discoveries.costliestProject.priceMaxCr} Cr)
                        </span>
                    </div>

                    {/* Table of 12 Corrupt Records */}
                    <div className="mt-3 overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50/80 text-[11px] font-semibold text-gray-600">
                                    <th className="py-2 px-2.5">Listing ID</th>
                                    <th className="py-2 px-2.5">Locality</th>
                                    <th className="py-2 px-2.5">Floor / Total</th>
                                    <th className="py-2 px-2.5">Carpet Area</th>
                                    <th className="py-2 px-2.5">Raw Price</th>
                                    <th className="py-2 px-2.5">Data Anomaly Identified</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                                {(discoveries.corruptRecords || []).map((rec) => (
                                    <tr key={rec.id} className="hover:bg-amber-50/40">
                                        <td className="py-1.5 px-2.5 font-bold text-gray-900">{rec.id}</td>
                                        <td className="py-1.5 px-2.5 font-sans capitalize text-gray-700">{rec.locality}</td>
                                        <td className={`py-1.5 px-2.5 ${rec.floor > rec.total_floors ? "text-amber-700 font-bold" : "text-gray-600"}`}>
                                            {rec.floor} / {rec.total_floors}
                                        </td>
                                        <td className="py-1.5 px-2.5 font-sans text-gray-600">{rec.carpet_area} sq ft</td>
                                        <td className={`py-1.5 px-2.5 ${rec.price <= 0 ? "text-rose-600 font-bold" : "text-gray-800"}`}>
                                            ₹ {rec.price.toLocaleString("en-IN")}
                                        </td>
                                        <td className="py-1.5 px-2.5 font-sans">
                                            <span className="inline-flex rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
                                                {rec.issue}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}


"use client";

import React from "react";
import Link from "next/link";
import { BarChart3, ArrowRight } from "lucide-react";

export function InsightsBanner() {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-xs text-emerald-950">
            <div className="flex items-center gap-2.5">
                <BarChart3 className="h-4 w-4 text-[#047857] shrink-0" />
                <p className="font-medium text-emerald-900">
                    Insights are based on currently available listings on Ivy Homes. Prices and trends may vary over time.
                </p>
            </div>

            <Link
                href="/listings"
                className="inline-flex items-center gap-1 font-semibold text-[#047857] hover:underline shrink-0"
            >
                <span>Learn more</span>
                <ArrowRight className="h-3.5 w-3.5" />
            </Link>
        </div>
    );
}

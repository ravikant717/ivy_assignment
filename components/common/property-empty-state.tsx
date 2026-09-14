"use client";

import React from "react";
import Link from "next/link";
import { Search, MapPin, Lightbulb } from "lucide-react";

export interface PropertyEmptyStateProps {
    title?: string;
    description?: string;
    primaryActionLabel?: string;
    secondaryActionLabel?: string;
    onReset?: () => void;
    onSecondaryAction?: () => void;
    secondaryHref?: string;
    tip?: string | null;
    illustrationSrc?: string;
    compact?: boolean;
    className?: string;

    // Legacy backward-compatibility props
    actionLabel?: string;
    emoji?: string;
}

export function PropertyEmptyState({
    title = "No listings found",
    description = "We couldn’t find any properties matching your criteria.\nTry adjusting your filters or searching in a different location.",
    primaryActionLabel,
    secondaryActionLabel = "Browse all listings",
    onReset,
    onSecondaryAction,
    secondaryHref = "/listings",
    tip = "Tip: Try a broader location or a wider price range",
    illustrationSrc = "/images/empty-living-room.png",
    compact = false,
    className = "",
    actionLabel,
}: PropertyEmptyStateProps) {
    const effectivePrimaryLabel = primaryActionLabel || actionLabel || "Try different filters";

    return (
        <div
            className={`flex flex-col items-center justify-center text-center rounded-3xl border border-gray-100 bg-white shadow-xs ${
                compact ? "py-8 px-4" : "py-12 px-6 sm:py-16 sm:px-8"
            } ${className}`}
        >
            {/* 3D Living Room Illustration */}
            <div className="relative mb-5 flex items-center justify-center">
                <img
                    src={illustrationSrc}
                    alt="Empty state illustration"
                    className={`select-none object-contain transition-transform duration-300 hover:scale-[1.02] ${
                        compact ? "h-36 w-auto" : "h-48 sm:h-56 md:h-64 w-auto"
                    }`}
                />
            </div>

            {/* Headline */}
            <h2
                className={`font-extrabold tracking-tight text-[#0F172A] ${
                    compact ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl"
                }`}
            >
                {title}
            </h2>

            {/* Body Description */}
            <p
                className={`mt-2 leading-relaxed text-slate-500 whitespace-pre-line ${
                    compact ? "text-xs max-w-sm" : "text-sm sm:text-base max-w-md"
                }`}
            >
                {description}
            </p>

            {/* Action Buttons Row */}
            <div
                className={`flex flex-wrap items-center justify-center gap-3 ${
                    compact ? "mt-5" : "mt-7"
                }`}
            >
                {/* Primary Button: Try different filters */}
                {onReset && (
                    <button
                        type="button"
                        onClick={onReset}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#047857] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:bg-[#065f46] active:scale-95"
                    >
                        <Search className="h-4 w-4" />
                        <span>{effectivePrimaryLabel}</span>
                    </button>
                )}

                {/* Secondary Button: Browse all listings */}
                {onSecondaryAction ? (
                    <button
                        type="button"
                        onClick={onSecondaryAction}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-gray-800 shadow-2xs transition hover:bg-gray-50 hover:border-gray-400 active:scale-95"
                    >
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{secondaryActionLabel}</span>
                    </button>
                ) : (
                    secondaryHref && (
                        <Link
                            href={secondaryHref}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-gray-800 shadow-2xs transition hover:bg-gray-50 hover:border-gray-400 active:scale-95"
                        >
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{secondaryActionLabel}</span>
                        </Link>
                    )
                )}
            </div>

            {/* Tip Line with Divider */}
            {tip && (
                <div
                    className={`relative w-full max-w-md flex items-center justify-center ${
                        compact ? "mt-6" : "mt-9"
                    }`}
                >
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200/80" />
                    </div>
                    <div className="relative flex items-center gap-1.5 bg-white px-3 text-[11px] sm:text-xs text-slate-500 font-medium">
                        <Lightbulb className="h-3.5 w-3.5 text-amber-500/90 shrink-0" />
                        <span>{tip}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

// Named alias for convenience
export const EmptyState = PropertyEmptyState;

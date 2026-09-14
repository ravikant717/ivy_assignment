"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface LoadMoreFooterProps {
    currentCount: number;
    totalCount: number;
    hasMore: boolean;
    isLoadingMore: boolean;
    onLoadMore: () => void;
    entityLabel?: string;
    buttonText?: string;
    loadingText?: string;
    className?: string;
}

export function LoadMoreFooter({
    currentCount,
    totalCount,
    hasMore,
    isLoadingMore,
    onLoadMore,
    entityLabel = "properties",
    buttonText = "Load More Properties",
    loadingText = "Loading more properties...",
    className = "",
}: LoadMoreFooterProps) {
    return (
        <div className={`pt-4 pb-8 text-center ${className}`}>
            <p className="mb-3 text-xs text-gray-500">
                Showing {currentCount} of {totalCount.toLocaleString("en-IN")}{" "}
                {entityLabel}
            </p>

            {hasMore && (
                <button
                    type="button"
                    onClick={onLoadMore}
                    disabled={isLoadingMore}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
                >
                    {isLoadingMore ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin text-[#047857]" />
                            <span>{loadingText}</span>
                        </>
                    ) : (
                        <span>{buttonText}</span>
                    )}
                </button>
            )}

            {!hasMore && currentCount > 0 && (
                <p className="text-xs text-gray-400 font-medium">
                    All {totalCount.toLocaleString("en-IN")} {entityLabel} loaded
                </p>
            )}
        </div>
    );
}

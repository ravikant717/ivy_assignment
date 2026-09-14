"use client";

import React from "react";

interface PropertyEmptyStateProps {
    emoji?: string;
    title: string;
    description: string;
    actionLabel?: string;
    onReset: () => void;
    className?: string;
}

export function PropertyEmptyState({
    emoji = "🏡",
    title,
    description,
    actionLabel = "Clear all filters",
    onReset,
    className = "",
}: PropertyEmptyStateProps) {
    return (
        <div
            className={`rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm ${className}`}
        >
            <div className="mb-3 text-3xl">{emoji}</div>
            <h2 className="text-base font-bold text-gray-900">{title}</h2>
            <p className="mt-1 text-xs text-gray-500">{description}</p>
            <button
                type="button"
                onClick={onReset}
                className="mt-4 rounded-xl bg-[#047857] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#065f46]"
            >
                {actionLabel}
            </button>
        </div>
    );
}

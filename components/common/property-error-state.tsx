"use client";

import React from "react";
import { RefreshCw } from "lucide-react";

interface PropertyErrorStateProps {
    error: unknown;
    onRetry: () => void;
    fallbackMessage?: string;
    className?: string;
}

export function PropertyErrorState({
    error,
    onRetry,
    fallbackMessage = "Failed to load properties.",
    className = "",
}: PropertyErrorStateProps) {
    const message =
        error instanceof Error ? error.message : fallbackMessage;

    return (
        <div
            className={`my-12 rounded-2xl border border-red-100 bg-red-50/50 p-8 text-center ${className}`}
        >
            <p className="text-sm font-medium text-red-600">{message}</p>
            <button
                type="button"
                onClick={onRetry}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#047857] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#065f46]"
            >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry
            </button>
        </div>
    );
}

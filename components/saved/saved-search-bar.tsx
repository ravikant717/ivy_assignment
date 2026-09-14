"use client";

import React from "react";
import { Search } from "lucide-react";

interface SavedSearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (e?: React.FormEvent) => void;
    placeholder?: string;
}

export function SavedSearchBar({
    value,
    onChange,
    onSubmit,
    placeholder = "Search your saved listings...",
}: SavedSearchBarProps) {
    return (
        <form onSubmit={onSubmit} className="flex gap-2.5">
            <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 shadow-xs transition focus:border-[#047857] focus:outline-none focus:ring-1 focus:ring-[#047857]"
                />
            </div>
            <button
                type="submit"
                className="rounded-xl bg-[#047857] px-7 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-[#065f46] active:scale-[0.98]"
            >
                Search
            </button>
        </form>
    );
}

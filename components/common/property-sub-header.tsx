"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { SortDropdown, type SortDropdownOption } from "./sort-dropdown";

interface PropertySubHeaderProps<T extends string> {
    title: string;
    isFetching?: boolean;
    sort: T;
    onSortChange: (sort: T) => void;
    sortOptions: Record<T, { label: string }> | SortDropdownOption<T>[];
    className?: string;
}

export function PropertySubHeader<T extends string>({
    title,
    isFetching = false,
    sort,
    onSortChange,
    sortOptions,
    className = "",
}: PropertySubHeaderProps<T>) {
    return (
        <section className={`mb-4 flex items-center justify-between ${className}`}>
            <div className="flex items-center gap-3">
                <h1 className="text-lg font-bold tracking-tight text-gray-900">
                    {title}
                </h1>

                {/* Subtle background fetching indicator */}
                {isFetching && (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                )}
            </div>

            <SortDropdown
                options={sortOptions}
                value={sort}
                onChange={onSortChange}
            />
        </section>
    );
}

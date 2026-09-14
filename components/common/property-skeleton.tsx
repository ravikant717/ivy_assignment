"use client";

import React from "react";

interface PropertySkeletonProps {
    cardCount?: number;
    className?: string;
}

export function PropertySkeleton({
    cardCount = 4,
    className = "",
}: PropertySkeletonProps) {
    return (
        <div className={`grid grid-cols-1 gap-6 lg:grid-cols-12 ${className}`}>
            <div className="space-y-4 lg:col-span-7">
                {Array.from({ length: cardCount }).map((_, i) => (
                    <div
                        key={i}
                        className="h-44 animate-pulse rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                    />
                ))}
            </div>
            <div className="lg:col-span-5">
                <div className="h-[550px] animate-pulse rounded-3xl border border-gray-100 bg-gray-100" />
            </div>
        </div>
    );
}

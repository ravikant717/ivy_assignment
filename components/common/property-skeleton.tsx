"use client";

import React from "react";
import { PropertyLoadingState } from "./property-loading-state";

interface PropertySkeletonProps {
    className?: string;
    title?: string;
    subtitle?: string;
    cardCount?: number;
}

export function PropertySkeleton({
    className = "",
    title = "Finding the best properties for you...",
    subtitle = "This may take a few seconds. Hang tight!",
}: PropertySkeletonProps) {
    return (
        <div className={`w-full rounded-3xl border border-gray-100 bg-white shadow-2xs ${className}`}>
            <PropertyLoadingState title={title} subtitle={subtitle} />
        </div>
    );
}

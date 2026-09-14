"use client";

import React from "react";
import { Navbar } from "@/components/listings/navbar";

export interface PropertyLoadingStateProps {
    title?: string;
    subtitle?: string;
    illustrationSrc?: string;
    fullPage?: boolean;
    withNavbar?: boolean;
    activeNavTab?: "listings" | "rentals" | "projects" | "insights" | "saved";
    className?: string;
}

export function PropertyLoadingState({
    title = "Finding the best properties for you...",
    subtitle = "This may take a few seconds. Hang tight!",
    illustrationSrc = "/images/loading-house.png",
    fullPage = false,
    withNavbar = false,
    activeNavTab = "listings",
    className = "",
}: PropertyLoadingStateProps) {
    const content = (
        <div
            className={`flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24 animate-fade-in ${
                fullPage ? "min-h-[65vh]" : "min-h-[420px]"
            } ${className}`}
        >
            {/* Top House & Trees Illustration */}
            <div className="relative mb-6 flex items-center justify-center">
                <img
                    src={illustrationSrc}
                    alt="Loading illustration"
                    className="h-28 sm:h-36 md:h-40 w-auto select-none object-contain transition-transform duration-500 hover:scale-105"
                />
            </div>

            {/* Circular Green Spinner */}
            <div className="relative mb-5 flex items-center justify-center">
                <div
                    className="h-8 w-8 sm:h-9 sm:w-9 animate-spin rounded-full border-[3px] border-emerald-100 border-t-[#047857] shadow-2xs"
                    role="status"
                    aria-label="loading"
                />
            </div>

            {/* Headline */}
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A]">
                {title}
            </h2>

            {/* Subtitle */}
            <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-sm">
                {subtitle}
            </p>
        </div>
    );

    if (withNavbar) {
        return (
            <div className="min-h-screen bg-[#FDFDFD]">
                <Navbar activeTab={activeNavTab} />
                <main className="mx-auto max-w-[1440px] px-4 md:px-8">
                    {content}
                </main>
            </div>
        );
    }

    return content;
}

// Named alias
export const LoadingState = PropertyLoadingState;

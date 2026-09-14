"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, LogOut, User, MapPin } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

import { useFavourites } from "@/lib/hooks/use-favourites";
import { IvyLogo } from "@/components/common/ivy-logo";

interface NavbarProps {
    savedCount?: number;
    userName?: string;
    activeTab?: "listings" | "rentals" | "projects" | "insights" | "saved";
}

export function Navbar({ savedCount: propSavedCount, userName = "Ravikant", activeTab }: NavbarProps) {
    const { count: liveSavedCount } = useFavourites();
    const savedCount = propSavedCount !== undefined ? propSavedCount : liveSavedCount;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const currentTab = activeTab || (
        pathname?.startsWith("/rentals")
            ? "rentals"
            : pathname?.startsWith("/projects")
            ? "projects"
            : pathname?.startsWith("/insights")
            ? "insights"
            : pathname?.startsWith("/saved")
            ? "saved"
            : "listings"
    );

    async function handleLogout() {
        try {
            await fetch("/api/logout", { method: "POST" });
            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error("Logout error:", error);
        }
    }

    return (
        <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
            <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-3.5 md:px-10">
                {/* Left: Brand Logo & Navigation */}
                <div className="flex items-center gap-10">
                    <Link href="/listings" className="flex items-center">
                        <IvyLogo className="h-6 w-auto" />
                    </Link>

                    {/* Active Market City Badge */}
                    <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/70 px-2.5 py-1 text-xs font-semibold text-[#047857]">
                        <MapPin className="h-3.5 w-3.5 text-[#047857]" />
                        <span>Gurgaon</span>
                    </div>

                    {/* Navigation Links */}
                    <nav className="hidden items-center gap-8 md:flex">
                        <Link
                            href="/listings"
                            className={`relative py-2 text-sm transition ${
                                currentTab === "listings"
                                    ? "font-semibold text-gray-900"
                                    : "font-medium text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            Listings
                            {currentTab === "listings" && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#047857]" />
                            )}
                        </Link>
                        <Link
                            href="/rentals"
                            className={`relative py-2 text-sm transition ${
                                currentTab === "rentals"
                                    ? "font-semibold text-gray-900"
                                    : "font-medium text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            Rentals
                            {currentTab === "rentals" && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#047857]" />
                            )}
                        </Link>
                        <Link
                            href="/projects"
                            className={`relative py-2 text-sm transition ${
                                currentTab === "projects"
                                    ? "font-semibold text-gray-900"
                                    : "font-medium text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            Projects
                            {currentTab === "projects" && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#047857]" />
                            )}
                        </Link>
                        <Link
                            href="/insights"
                            className={`relative py-2 text-sm transition ${
                                currentTab === "insights"
                                    ? "font-semibold text-gray-900"
                                    : "font-medium text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            Insights
                            {currentTab === "insights" && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#047857]" />
                            )}
                        </Link>
                        <Link
                            href="/saved"
                            className={`flex items-center gap-1.5 relative py-2 text-sm transition ${
                                currentTab === "saved"
                                    ? "font-semibold text-gray-900"
                                    : "font-medium text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            Saved
                            {savedCount > 0 && (
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-[#047857]">
                                    {savedCount}
                                </span>
                            )}
                            {currentTab === "saved" && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#047857]" />
                            )}
                        </Link>
                    </nav>
                </div>

                {/* Right: User Profile */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2.5 rounded-full border border-gray-100 bg-gray-50/70 p-1.5 pr-3 transition hover:bg-gray-100"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-[#047857]">
                            RK
                        </div>
                        <span className="text-sm font-medium text-gray-800">
                            {userName}
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-100 bg-white py-1.5 shadow-lg">
                            <div className="border-b border-gray-100 px-4 py-2">
                                <p className="text-xs text-gray-500">Signed in as</p>
                                <p className="text-sm font-semibold text-gray-800">{userName}</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Search,
    MapPin,
    Building2,
    ChevronDown,
    X,
} from "lucide-react";
import {
    GURGAON_LOCALITIES,
    PROJECT_STATUS_OPTIONS,
} from "@/lib/constants/filters";
import type { ProjectFilterState } from "@/lib/hooks/use-projects";

interface ProjectFilterBarProps {
    filters: ProjectFilterState;
    onChange: (filters: ProjectFilterState) => void;
    onReset: () => void;
    availableLocalities?: readonly string[] | string[];
}

export function ProjectFilterBar({
    filters,
    onChange,
    onReset,
    availableLocalities = GURGAON_LOCALITIES,
}: ProjectFilterBarProps) {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close popover when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpenDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const hasActiveFilters =
        filters.locality !== "" ||
        filters.status !== "" ||
        filters.search !== "";

    const selectedStatusLabel =
        PROJECT_STATUS_OPTIONS.find((s) => s.value === filters.status)?.label ||
        "Project Status";

    return (
        <div ref={containerRef} className="w-full space-y-3.5">
            {/* Search Input Bar */}
            <div className="relative flex items-center rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm transition focus-within:border-[#047857] focus-within:ring-2 focus-within:ring-[#047857]/10">
                <Search className="ml-3 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    value={filters.search}
                    onChange={(e) =>
                        onChange({ ...filters, search: e.target.value })
                    }
                    placeholder="Search by project name, developer, locality, or amenities..."
                    className="w-full bg-transparent px-3 py-1.5 text-sm text-gray-800 placeholder-gray-400 outline-none"
                />
                {filters.search && (
                    <button
                        type="button"
                        onClick={() => onChange({ ...filters, search: "" })}
                        className="mr-2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
                <button
                    type="button"
                    aria-label="Search"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#047857] text-white transition hover:bg-[#065f46]"
                >
                    <Search className="h-4 w-4" />
                </button>
            </div>

            {/* Filter Pills Row */}
            <div className="flex flex-wrap items-center gap-2.5">
                {/* Locality Dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => toggleDropdown("locality")}
                        className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition ${
                            filters.locality
                                ? "border-[#047857] bg-emerald-50/60 text-[#047857]"
                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <MapPin className="h-3.5 w-3.5 text-gray-500" />
                        <span>{filters.locality || "Locality"}</span>
                        <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                    </button>

                    {openDropdown === "locality" && (
                        <div className="absolute left-0 top-full z-30 mt-1.5 w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
                            <button
                                type="button"
                                onClick={() => {
                                    onChange({ ...filters, locality: "" });
                                    setOpenDropdown(null);
                                }}
                                className={`w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium transition ${
                                    !filters.locality
                                        ? "bg-emerald-50 text-[#047857]"
                                        : "text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                All Localities
                            </button>
                            {availableLocalities.map((loc) => (
                                <button
                                    key={loc}
                                    type="button"
                                    onClick={() => {
                                        onChange({ ...filters, locality: loc });
                                        setOpenDropdown(null);
                                    }}
                                    className={`w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium transition ${
                                        filters.locality.toLowerCase() === loc.toLowerCase()
                                            ? "bg-emerald-50 text-[#047857]"
                                            : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    {loc}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Project Status Dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => toggleDropdown("status")}
                        className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition ${
                            filters.status
                                ? "border-[#047857] bg-emerald-50/60 text-[#047857]"
                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        <Building2 className="h-3.5 w-3.5 text-gray-500" />
                        <span>{selectedStatusLabel}</span>
                        <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                    </button>

                    {openDropdown === "status" && (
                        <div className="absolute left-0 top-full z-30 mt-1.5 w-52 rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
                            {PROJECT_STATUS_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                        onChange({ ...filters, status: opt.value });
                                        setOpenDropdown(null);
                                    }}
                                    className={`w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium transition ${
                                        filters.status === opt.value
                                            ? "bg-emerald-50 text-[#047857]"
                                            : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Clear all button */}
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={onReset}
                        className="text-xs font-medium text-gray-500 underline-offset-4 transition hover:text-[#047857] hover:underline"
                    >
                        Clear all
                    </button>
                )}
            </div>
        </div>
    );
}

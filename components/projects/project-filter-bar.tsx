"use client";

import React, { useState } from "react";
import {
    Search,
    MapPin,
    Building2,
    RotateCcw,
    X,
} from "lucide-react";
import {
    GURGAON_LOCALITIES,
    PROJECT_STATUS_OPTIONS,
} from "@/lib/constants/filters";
import type { ProjectFilterState } from "@/lib/hooks/use-projects";
import { FilterDropdown } from "@/components/common/filter-dropdown";

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

    const toggleDropdown = (name: string) => {
        setOpenDropdown((prev) => (prev === name ? null : name));
    };

    const hasActiveFilters =
        Boolean(filters.locality) ||
        Boolean(filters.status) ||
        Boolean(filters.search);

    const localityOptions = availableLocalities.map((loc) => ({
        value: loc,
        label: loc,
    }));

    const statusOptions = PROJECT_STATUS_OPTIONS
        .filter((s) => s.value !== "")
        .map((s) => ({
            value: s.value,
            label: s.label,
        }));

    return (
        <div className="w-full space-y-3.5">
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
            </div>

            {/* Filter Pills Row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                {/* Locality Dropdown */}
                <FilterDropdown
                    id="locality"
                    icon={<MapPin className="h-3.5 w-3.5" />}
                    label="All Localities"
                    selectedValue={filters.locality}
                    options={localityOptions}
                    placeholder="All Localities"
                    isOpen={openDropdown === "locality"}
                    onToggle={() => toggleDropdown("locality")}
                    onChange={(val) => onChange({ ...filters, locality: val })}
                    menuWidth="w-64"
                />

                {/* Status Dropdown */}
                <FilterDropdown
                    id="status"
                    icon={<Building2 className="h-3.5 w-3.5" />}
                    label="Project Status"
                    selectedValue={filters.status}
                    options={statusOptions}
                    placeholder="All Statuses"
                    isOpen={openDropdown === "status"}
                    onToggle={() => toggleDropdown("status")}
                    onChange={(val) => onChange({ ...filters, status: val })}
                    menuWidth="w-56"
                />

                {/* Reset Filters Pill */}
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={onReset}
                        className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/70 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100/70 active:scale-95 shadow-2xs"
                    >
                        <RotateCcw className="h-3 w-3" />
                        <span>Reset Filters</span>
                    </button>
                )}
            </div>
        </div>
    );
}

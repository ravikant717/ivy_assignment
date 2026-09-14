"use client";

import React from "react";
import { Building, Layers, Maximize2 } from "lucide-react";
import type { Project } from "@/types/project";
import { getListingImage } from "@/lib/listing-images";
import { FavoriteButton } from "@/components/common/favorite-button";
import {
    formatLocality,
    formatProjectPriceRange,
    formatAreaRange,
} from "@/lib/formatters";

export interface ProjectCardProps {
    project: Project;
    index: number;
    isSelected?: boolean;
    isSaved?: boolean;
    onToggleSave?: (projectId: string) => void;
    onSelect?: (project: Project) => void;
}

export function ProjectCard({
    project,
    index,
    isSelected = false,
    isSaved = false,
    onToggleSave,
    onSelect,
}: ProjectCardProps) {
    const imageUrl = getListingImage(project.project_id, index);

    const statusStyle =
        project.project_status?.toLowerCase() === "ready to move"
            ? "bg-emerald-50 text-[#047857]"
            : project.project_status?.toLowerCase() === "new launch"
            ? "bg-purple-50 text-purple-700"
            : "bg-amber-50 text-amber-700";

    return (
        <article
            onClick={() => onSelect?.(project)}
            className={`group relative flex cursor-pointer flex-col gap-4 rounded-2xl border bg-white p-3.5 shadow-sm transition duration-200 sm:flex-row sm:items-center sm:gap-5 hover:shadow-md ${
                isSelected
                    ? "border-[#047857] ring-2 ring-[#047857]/30 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
            }`}
        >
            {/* Left Image */}
            <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-40 sm:w-52 md:h-44 md:w-60">
                <img
                    src={imageUrl}
                    alt={project.apartment_name || "Project"}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                />
            </div>

            {/* Right Details */}
            <div className="flex flex-1 flex-col justify-between self-stretch py-0.5">
                {/* Top: Status Badges and Save Button */}
                <div className="flex items-start justify-between">
                    <div className="flex flex-wrap items-center gap-1.5">
                        {project.project_status && (
                            <span
                                className={`rounded-md px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase ${statusStyle}`}
                            >
                                {project.project_status}
                            </span>
                        )}
                        {project.total_listings !== undefined && project.total_listings > 0 && (
                            <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700">
                                {project.total_listings} units available
                            </span>
                        )}
                    </div>

                    <FavoriteButton
                        isSaved={isSaved}
                        onToggle={() => onToggleSave?.(project.project_id)}
                        label="Save project"
                    />
                </div>

                {/* Developer & Apartment Name */}
                <div className="mt-1">
                    {project.developer_name && (
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                            By {project.developer_name}
                        </p>
                    )}
                    <h2 className="text-base font-bold text-gray-900 transition group-hover:text-[#047857] line-clamp-1">
                        {project.apartment_name || "Residential Project"}
                    </h2>
                    <p className="text-xs text-gray-500 capitalize">
                        {formatLocality(project.locality)}
                    </p>
                </div>

                {/* Price Range */}
                <div className="mt-2">
                    <p className="text-lg font-extrabold text-gray-950">
                        {formatProjectPriceRange(project.price_min, project.price_max)}
                    </p>
                </div>

                {/* Specs Row */}
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                        <Maximize2 className="h-3.5 w-3.5 text-gray-500" />
                        <span>
                            {formatAreaRange(project.min_area_sqft, project.max_area_sqft)}
                        </span>
                    </div>
                    {project.total_units !== undefined && project.total_units > 0 && (
                        <div className="flex items-center gap-1.5">
                            <Building className="h-3.5 w-3.5 text-gray-500" />
                            <span>{project.total_units.toLocaleString("en-IN")} units</span>
                        </div>
                    )}
                    {project.total_floors !== undefined && project.total_floors > 0 && (
                        <div className="flex items-center gap-1.5">
                            <Layers className="h-3.5 w-3.5 text-gray-500" />
                            <span>{project.total_floors} floors</span>
                        </div>
                    )}
                </div>

                {/* Amenities Badges */}
                {project.amenities && project.amenities.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {project.amenities.slice(0, 4).map((amenity) => (
                            <span
                                key={amenity}
                                className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 capitalize"
                            >
                                {amenity}
                            </span>
                        ))}
                        {project.amenities.length > 4 && (
                            <span className="rounded-full bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
                                +{project.amenities.length - 4} more
                            </span>
                        )}
                    </div>
                )}
            </div>
        </article>
    );
}

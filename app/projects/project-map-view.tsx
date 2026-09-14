"use client";

import React from "react";
import type { Project } from "@/types/project";
import { getListingImage } from "@/lib/listing-images";
import {
    formatLocality,
    formatProjectPriceRange,
} from "@/lib/formatters";
import { InteractiveMapView } from "@/components/common/interactive-map-view";

interface ProjectMapViewProps {
    projects: Project[];
    selectedProject: Project | null;
    onSelectProject: (project: Project) => void;
    className?: string;
}

export function ProjectMapView({
    projects,
    selectedProject,
    onSelectProject,
    className,
}: ProjectMapViewProps) {
    return (
        <InteractiveMapView<Project>
            items={projects}
            selectedItem={selectedProject}
            onSelectItem={onSelectProject}
            getItemId={(p) => p.project_id}
            getItemCoords={(p) => {
                let lat = Number(p.latitude);
                let lng = Number(p.longitude);
                if (lat > 70 && lng < 35) {
                    const temp = lat;
                    lat = lng;
                    lng = temp;
                }
                return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null;
            }}
            getItemPopupData={(p, index) => ({
                title: p.apartment_name || "Residential Project",
                badge: p.developer_name ? `By ${p.developer_name}` : undefined,
                subtitle: formatLocality(p.locality),
                price: formatProjectPriceRange(p.price_min, p.price_max),
                imageUrl: getListingImage(p.project_id, index),
            })}
            className={className}
        />
    );
}

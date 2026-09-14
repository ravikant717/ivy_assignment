import React from "react";
import {
    Building,
    Zap,
    Car,
    ShieldCheck,
    Droplets,
    Wrench,
    Dumbbell,
    Gamepad2,
    MapPin,
    Sparkles,
    ChevronRight,
} from "lucide-react";
import type { Listing } from "@/types/listing";
import type { DetailTabType } from "./property-tabs";

interface TabOverviewProps {
    listing: Listing;
    carpetAreaStr: string;
    floorStr: string;
    localityFormatted: string;
    similarCount: number;
    onNavigateTab: (tab: DetailTabType) => void;
}

export function TabOverview({
    listing,
    carpetAreaStr,
    floorStr,
    localityFormatted,
    similarCount,
    onNavigateTab,
}: TabOverviewProps) {
    const amenities = [
        { icon: Building, label: "Lift" },
        { icon: Zap, label: "Power Backup" },
        { icon: Car, label: "Car Parking" },
        { icon: ShieldCheck, label: "Security" },
        { icon: Droplets, label: "Water Supply" },
        { icon: Wrench, label: "Maintenance" },
        { icon: Dumbbell, label: "Gym" },
        { icon: Gamepad2, label: "Children's Play Area" },
    ];

    return (
        <div className="space-y-5 pt-1">
            {/* Property Quick Summary Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3 text-center">
                    <p className="text-[11px] text-gray-500 font-medium">Configuration</p>
                    <p className="text-xs font-bold text-gray-900 mt-0.5">
                        {listing.bedroom || 2} BHK {listing.property_type || "Apartment"}
                    </p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3 text-center">
                    <p className="text-[11px] text-gray-500 font-medium">Carpet Area</p>
                    <p className="text-xs font-bold text-gray-900 mt-0.5">{carpetAreaStr}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3 text-center">
                    <p className="text-[11px] text-gray-500 font-medium">Floor Level</p>
                    <p className="text-xs font-bold text-gray-900 mt-0.5">{floorStr}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3 text-center">
                    <p className="text-[11px] text-gray-500 font-medium">Facing</p>
                    <p className="text-xs font-bold text-gray-900 mt-0.5 capitalize">
                        {listing.facing_direction ? `${listing.facing_direction}` : "North Facing"}
                    </p>
                </div>
            </div>

            {/* Amenities Preview (Matching Screenshot) */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-gray-900">Amenities</h2>
                    <button
                        type="button"
                        onClick={() => onNavigateTab("amenities")}
                        className="text-xs font-semibold text-[#047857] hover:underline flex items-center gap-1"
                    >
                        <span>View all amenities</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                </div>
                <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                    {amenities.map((item, idx) => {
                        const IconComponent = item.icon;
                        return (
                            <div
                                key={idx}
                                className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-3.5 text-center shadow-xs transition hover:border-gray-300 hover:shadow-sm"
                            >
                                <IconComponent className="h-5 w-5 text-gray-600 mb-1.5" />
                                <span className="text-[11px] font-medium leading-tight text-gray-700">
                                    {item.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Fast-Jump Banners to Location & Similar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                    type="button"
                    onClick={() => onNavigateTab("location")}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 p-3 text-left transition hover:bg-emerald-50/50 hover:border-emerald-200"
                >
                    <div className="flex items-center gap-2.5">
                        <MapPin className="h-4 w-4 text-[#047857] shrink-0" />
                        <div>
                            <p className="text-xs font-bold text-gray-900">Explore Location</p>
                            <p className="text-[11px] text-gray-500 truncate max-w-[160px] sm:max-w-[180px]">
                                {localityFormatted}
                            </p>
                        </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>

                <button
                    type="button"
                    onClick={() => onNavigateTab("similar")}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 p-3 text-left transition hover:bg-emerald-50/50 hover:border-emerald-200"
                >
                    <div className="flex items-center gap-2.5">
                        <Sparkles className="h-4 w-4 text-[#047857] shrink-0" />
                        <div>
                            <p className="text-xs font-bold text-gray-900">Similar Listings</p>
                            <p className="text-[11px] text-gray-500">
                                {similarCount} comparable properties
                            </p>
                        </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
            </div>
        </div>
    );
}

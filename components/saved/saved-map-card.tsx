"use client";

import React from "react";
import { MapPin, ChevronRight } from "lucide-react";

interface SavedMapCardProps {
    count: number;
    onClick?: () => void;
}

export function SavedMapCard({ count, onClick }: SavedMapCardProps) {
    return (
        <div
            onClick={onClick}
            className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white/95 p-3.5 shadow-lg backdrop-blur-md transition hover:bg-white cursor-pointer"
        >
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                    <MapPin className="h-4.5 w-4.5 text-[#047857]" />
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-900">
                        {count} saved {count === 1 ? "property" : "properties"}
                    </p>
                    <p className="text-[11px] text-gray-500">Across Gurgaon</p>
                </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
        </div>
    );
}

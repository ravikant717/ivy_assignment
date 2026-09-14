import React from "react";
import { MapPin, ExternalLink } from "lucide-react";
import type { Listing } from "@/types/listing";

interface TabLocationProps {
    listing: Listing;
    localityFormatted: string;
}

export function TabLocation({ listing, localityFormatted }: TabLocationProps) {
    const lat = listing.latitude || 28.398;
    const lon = listing.longitude || 77.054;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

    const commuteLandmarks = [
        { emoji: "🚇", title: "Metro Station", dist: "800 m (10 mins walk)" },
        { emoji: "🏥", title: "Multi-Specialty Hospital", dist: "1.5 km (5 mins drive)" },
        { emoji: "🏫", title: "Reputed Schools", dist: "1.2 km (4 mins drive)" },
        { emoji: "🛍️", title: "Market & High Street", dist: "500 m (6 mins walk)" },
        { emoji: "💼", title: "Tech & Business Hub", dist: "4.5 km (12 mins drive)" },
        { emoji: "✈️", title: "Railway & Airport", dist: "8.5 km (20 mins drive)" },
    ];

    const localityTags = [
        "✓ Peaceful Residential Pocket",
        "✓ Wide 60ft Tree-Lined Roads",
        "✓ 24/7 Municipal Water Zone",
        "✓ High Safety & Security Index",
    ];

    return (
        <div className="space-y-4 pt-1">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <h2 className="text-base font-bold text-gray-900">Location & Vicinity Connectivity</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {localityFormatted} • Lat: {lat}, Lon: {lon}
                    </p>
                </div>
                <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 flex items-center gap-1.5"
                >
                    <span>View on Maps</span>
                    <ExternalLink className="h-3 w-3" />
                </a>
            </div>

            {/* Visual Neighborhood Map */}
            <div className="h-56 w-full rounded-2xl overflow-hidden border border-gray-200 bg-emerald-50/40 flex items-center justify-center relative shadow-xs">
                <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=75"
                    alt="Neighborhood Map"
                    className="h-full w-full object-cover opacity-60"
                />
                <div className="absolute flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#047857] text-white shadow-xl ring-4 ring-white animate-bounce">
                        <MapPin className="h-5 w-5" />
                    </div>
                    <span className="mt-1 rounded-md bg-white/95 px-2.5 py-0.5 text-xs font-bold text-gray-900 shadow-md">
                        {listing.apartment_name || "Property Location"}
                    </span>
                </div>
            </div>

            {/* Comprehensive Commute Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-gray-700 pt-1">
                {commuteLandmarks.map((item, idx) => (
                    <div
                        key={idx}
                        className="rounded-xl border border-gray-100 bg-gray-50/70 p-2.5 flex items-center gap-2"
                    >
                        <span className="text-base">{item.emoji}</span>
                        <div>
                            <p className="font-bold text-gray-900">{item.title}</p>
                            <p className="text-[11px] text-gray-500">{item.dist}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Locality Highlights Tags */}
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-medium text-gray-600">
                <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-emerald-800 border border-emerald-100">
                    {localityTags[0]}
                </span>
                {localityTags.slice(1).map((tag, idx) => (
                    <span key={idx} className="rounded-lg bg-gray-100 px-2.5 py-1 text-gray-700">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}

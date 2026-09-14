"use client";

import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { Plus, Minus } from "lucide-react";
import type { LocalityInsight } from "@/lib/insights-data";

interface PriceHeatmapProps {
    localities: LocalityInsight[];
    city?: string;
    selectedLocality?: string | null;
    onSelectLocality?: (loc: string) => void;
}

export function PriceHeatmap({
    localities,
    city = "Gurgaon",
    selectedLocality,
    onSelectLocality,
}: PriceHeatmapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markersLayerRef = useRef<any>(null);

    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) {
            return;
        }

        let isMounted = true;

        import("leaflet").then((L) => {
            if (!isMounted || !mapContainerRef.current || mapInstanceRef.current) {
                return;
            }

            const isGurgaon = (city || "").toLowerCase().includes("gurgaon");
            const defaultCenter: [number, number] = isGurgaon ? [28.4595, 77.0266] : [12.9716, 77.5946];

            const map = L.map(mapContainerRef.current, {
                center: defaultCenter,
                zoom: 11,
                zoomControl: false,
            });

            L.tileLayer(
                "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
                {
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    subdomains: "abcd",
                    maxZoom: 19,
                }
            ).addTo(map);

            const markersLayer = L.layerGroup().addTo(map);
            mapInstanceRef.current = map;
            markersLayerRef.current = markersLayer;

            renderPriceMarkers(L, map, markersLayer);
        });

        return () => {
            isMounted = false;
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    function renderPriceMarkers(L: any, map: any, markersLayer: any) {
        if (!markersLayer) return;
        markersLayer.clearLayers();

        const coords: [number, number][] = [];

        localities.forEach((loc) => {
            if (!Number.isFinite(loc.lat) || !Number.isFinite(loc.lng)) return;
            coords.push([loc.lat, loc.lng]);

            const isSelected = selectedLocality === loc.locality;

            // Custom Price Pill Marker (green dot + text + selected state)
            const iconHtml = `
                <div class="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 shadow-md border transition duration-200 select-none cursor-pointer ${
                    isSelected
                        ? "bg-emerald-50 border-[#047857] ring-2 ring-[#047857]/40 scale-110 shadow-lg"
                        : "bg-white/95 border-gray-100 hover:scale-105"
                }">
                    <div class="h-2 w-2 rounded-full ${isSelected ? "bg-emerald-700 animate-pulse" : "bg-[#047857]"} shrink-0"></div>
                    <div class="leading-none">
                        <p class="text-[10px] font-semibold ${isSelected ? "text-emerald-950 font-bold" : "text-gray-700"} whitespace-nowrap">${loc.display_name}</p>
                        <p class="text-[11px] font-extrabold ${isSelected ? "text-[#047857]" : "text-gray-950"} whitespace-nowrap mt-0.5">${loc.price_label}</p>
                    </div>
                </div>
            `;

            const customIcon = L.divIcon({
                className: "custom-price-marker",
                html: iconHtml,
                iconSize: [100, 34],
                iconAnchor: [50, 17],
            });

            const marker = L.marker([loc.lat, loc.lng], { icon: customIcon });
            marker.on("click", () => {
                onSelectLocality?.(loc.locality);
            });
            marker.addTo(markersLayer);
        });

        if (coords.length > 0 && !selectedLocality) {
            const bounds = L.latLngBounds(coords);
            map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
        }
    }

    // Sync markers when localities or selectedLocality changes
    useEffect(() => {
        if (!mapInstanceRef.current || !markersLayerRef.current) return;
        import("leaflet").then((L) => {
            renderPriceMarkers(L, mapInstanceRef.current, markersLayerRef.current);

            if (selectedLocality) {
                const target = localities.find((l) => l.locality === selectedLocality);
                if (target && Number.isFinite(target.lat) && Number.isFinite(target.lng)) {
                    mapInstanceRef.current.panTo([target.lat, target.lng], {
                        animate: true,
                        duration: 0.8,
                    });
                }
            }
        });
    }, [localities, city, selectedLocality]);


    function handleZoomIn() {
        mapInstanceRef.current?.zoomIn();
    }

    function handleZoomOut() {
        mapInstanceRef.current?.zoomOut();
    }

    return (
        <div className="flex flex-col h-full rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
            {/* Header */}
            <div className="mb-3">
                <h3 className="text-base font-bold text-gray-900">Price Heatmap</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                    Explore average property prices across {city}.
                </p>
            </div>

            {/* Map Container */}
            <div className="relative flex-1 min-h-[480px] w-full overflow-hidden rounded-xl border border-gray-100 bg-[#f8fafc]">
                <div ref={mapContainerRef} className="h-full min-h-[480px] w-full z-0" />

                {/* Top-Right Zoom Controls */}
                <div className="absolute top-3 right-3 z-20 flex flex-col overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-md">
                    <button
                        type="button"
                        aria-label="Zoom in"
                        onClick={handleZoomIn}
                        className="flex h-8 w-8 items-center justify-center border-b border-gray-100 text-gray-700 transition hover:bg-gray-50 active:bg-gray-100"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        aria-label="Zoom out"
                        onClick={handleZoomOut}
                        className="flex h-8 w-8 items-center justify-center text-gray-700 transition hover:bg-gray-50 active:bg-gray-100"
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                </div>

                {/* Bottom Legend Scale */}
                <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-1.5 shadow-md border border-gray-100 text-[11px] font-semibold text-gray-700 backdrop-blur-sm">
                    <span>
                        ₹ {localities.length ? Math.min(...localities.map((l) => Math.round(l.price_sqft / 1000))) : 4}K
                    </span>
                    <div className="h-2.5 w-24 rounded-full bg-gradient-to-r from-emerald-100 via-emerald-400 to-[#047857]" />
                    <span>
                        ₹ {localities.length ? Math.max(...localities.map((l) => Math.round(l.price_sqft / 1000))) : 14}K
                    </span>
                </div>
            </div>
        </div>
    );
}

"use client";

import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { Plus, Minus } from "lucide-react";

export interface InteractiveMapViewProps<T> {
    items: T[];
    selectedItem: T | null;
    onSelectItem: (item: T) => void;
    getItemId: (item: T) => string;
    getItemCoords: (item: T) => [number, number] | null;
    getItemPopupData: (
        item: T,
        index: number
    ) => {
        title: string;
        subtitle?: string;
        price?: string;
        badge?: string;
        imageUrl: string;
    };
    className?: string;
}

export function InteractiveMapView<T>({
    items,
    selectedItem,
    onSelectItem,
    getItemId,
    getItemCoords,
    getItemPopupData,
    className = "",
}: InteractiveMapViewProps<T>) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markersLayerRef = useRef<any>(null);
    const markersMapRef = useRef<Map<string, any>>(new Map());

    // Initialize Leaflet map once
    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) {
            return;
        }

        let isMounted = true;

        import("leaflet").then((L) => {
            if (
                !isMounted ||
                !mapContainerRef.current ||
                mapInstanceRef.current
            ) {
                return;
            }

            // Default center on Gurgaon: 28.4595, 77.0266
            const map = L.map(mapContainerRef.current, {
                center: [28.4595, 77.0266],
                zoom: 12,
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

            renderMarkers(L, map, markersLayer);
        });

        return () => {
            isMounted = false;

            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Render markers on items change
    function renderMarkers(L: any, map: any, markersLayer: any) {
        if (!markersLayer) return;

        markersLayer.clearLayers();
        markersMapRef.current.clear();

        const validCoords: [number, number][] = [];

        items.forEach((item, index) => {
            const coords = getItemCoords(item);
            if (!coords) return;

            const [lat, lng] = coords;
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

            validCoords.push([lat, lng]);

            const id = getItemId(item);
            const popupData = getItemPopupData(item, index);

            // Custom green circular pin
            const iconHtml = `
                <div class="custom-pin flex items-center justify-center transition duration-200">
                    <div class="relative flex h-5 w-5 items-center justify-center rounded-full bg-[#047857] shadow-md ring-2 ring-white hover:scale-125">
                        <div class="h-1.5 w-1.5 rounded-full bg-white"></div>
                    </div>
                </div>
            `;

            const customIcon = L.divIcon({
                className: "custom-leaflet-marker",
                html: iconHtml,
                iconSize: [22, 22],
                iconAnchor: [11, 11],
                popupAnchor: [0, -12],
            });

            const marker = L.marker([lat, lng], { icon: customIcon });

            // Popup card
            const popupHtml = `
                <div class="flex items-center gap-3 p-1 font-sans cursor-pointer">
                    <img
                        src="${popupData.imageUrl}"
                        alt="${popupData.title}"
                        class="h-12 w-16 rounded-lg object-cover shadow-sm shrink-0"
                    />

                    <div class="text-left pr-1">
                        ${popupData.badge ? `<p class="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">${popupData.badge}</p>` : ""}
                        <p class="text-xs font-bold text-gray-900 leading-tight">
                            ${popupData.title}
                        </p>

                        ${popupData.subtitle ? `<p class="text-[11px] text-gray-500">${popupData.subtitle}</p>` : ""}

                        ${popupData.price ? `<p class="mt-0.5 text-xs font-extrabold text-gray-950">${popupData.price}</p>` : ""}
                    </div>
                </div>
            `;

            marker.bindPopup(popupHtml, {
                className: "custom-ivy-popup",
                closeButton: false,
                offset: [0, -8],
            });

            marker.on("click", () => {
                onSelectItem(item);
            });

            marker.addTo(markersLayer);
            markersMapRef.current.set(id, marker);
        });

        if (validCoords.length > 0) {
            const bounds = L.latLngBounds(validCoords);
            map.fitBounds(bounds, {
                padding: [40, 40],
                maxZoom: 14,
            });
        }
    }

    // Sync markers when items array changes
    useEffect(() => {
        if (!mapInstanceRef.current || !markersLayerRef.current) {
            return;
        }

        import("leaflet").then((L) => {
            renderMarkers(
                L,
                mapInstanceRef.current,
                markersLayerRef.current
            );
        });
    }, [items]);

    // Pan to selected marker
    useEffect(() => {
        if (!selectedItem || !mapInstanceRef.current) {
            return;
        }

        const id = getItemId(selectedItem);
        const marker = markersMapRef.current.get(id);
        if (!marker) return;

        const coords = getItemCoords(selectedItem);
        if (!coords) return;

        const [lat, lng] = coords;
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

        mapInstanceRef.current.panTo([lat, lng], {
            animate: true,
            duration: 0.6,
        });

        marker.openPopup();
    }, [selectedItem]);

    function handleZoomIn() {
        mapInstanceRef.current?.zoomIn();
    }

    function handleZoomOut() {
        mapInstanceRef.current?.zoomOut();
    }

    return (
        <div
            className={`relative h-full min-h-[550px] w-full overflow-hidden rounded-3xl border border-gray-200 bg-[#f5f6f8] shadow-sm ${className}`}
        >
            <div
                ref={mapContainerRef}
                className="h-full min-h-[550px] w-full z-0"
            />

            {/* Custom Floating Zoom Control Buttons */}
            <div className="absolute bottom-5 right-5 z-20 flex flex-col overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-md">
                <button
                    type="button"
                    aria-label="Zoom in"
                    onClick={handleZoomIn}
                    className="flex h-9 w-9 items-center justify-center border-b border-gray-100 text-gray-700 transition hover:bg-gray-50 active:bg-gray-100"
                >
                    <Plus className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    aria-label="Zoom out"
                    onClick={handleZoomOut}
                    className="flex h-9 w-9 items-center justify-center text-gray-700 transition hover:bg-gray-50 active:bg-gray-100"
                >
                    <Minus className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

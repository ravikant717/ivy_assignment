"use client";

import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { Plus, Minus } from "lucide-react";
import type { Listing } from "@/types/listing";
import { getListingImage } from "@/lib/listing-images";
import { formatIndianPrice, formatPropertyTitle } from "@/lib/formatters";
import { SavedMapCard } from "@/components/saved/saved-map-card";

interface SavedMapViewProps {
    listings: (Listing & { tag?: string; image_url?: string })[];
    selectedListing: Listing | null;
    onSelectListing: (listing: Listing) => void;
    className?: string;
}

export function SavedMapView({
    listings,
    selectedListing,
    onSelectListing,
    className = "",
}: SavedMapViewProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markersLayerRef = useRef<any>(null);
    const markersMapRef = useRef<Map<string, any>>(new Map());

    // Initialize Leaflet map centered on Gurgaon
    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) {
            return;
        }

        let isMounted = true;

        import("leaflet").then((L) => {
            if (!isMounted || !mapContainerRef.current || mapInstanceRef.current) {
                return;
            }

            // Gurgaon coordinates: 28.4595, 77.0266
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

    function renderMarkers(L: any, map: any, markersLayer: any) {
        if (!markersLayer) return;

        markersLayer.clearLayers();
        markersMapRef.current.clear();

        const validCoords: [number, number][] = [];

        listings.forEach((listing, index) => {
            // Use listing's coords or deterministic offset in Gurgaon if missing
            let lat = Number(listing.latitude) || 28.4595 + ((index % 3) - 1) * 0.04;
            let lng = Number(listing.longitude) || 77.0266 + ((index % 2) - 0.5) * 0.06;
            if (lat > 70 && lng < 35) {
                const temp = lat;
                lat = lng;
                lng = temp;
            }

            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

            validCoords.push([lat, lng]);

            const imageUrl =
                listing.image_url || getListingImage(listing.listing_id, index);
            const isRental =
                listing.property_type?.toLowerCase().includes("rent") ||
                Number(listing.price) < 200000;
            const priceFormatted = formatIndianPrice(listing.price, isRental);
            const titleFormatted = formatPropertyTitle(listing.bedroom, listing.property_type);

            // Custom green map pin marker
            const iconHtml = `
                <div class="custom-pin flex items-center justify-center transition duration-200">
                    <div class="relative flex h-6 w-6 items-center justify-center rounded-full bg-[#047857] shadow-md ring-2 ring-white hover:scale-125">
                        <div class="h-2 w-2 rounded-full bg-white"></div>
                    </div>
                </div>
            `;

            const customIcon = L.divIcon({
                className: "custom-leaflet-marker",
                html: iconHtml,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
                popupAnchor: [0, -14],
            });

            const marker = L.marker([lat, lng], { icon: customIcon });

            // Popup card
            const popupHtml = `
                <div class="flex items-center gap-3 p-1 font-sans cursor-pointer">
                    <img
                        src="${imageUrl}"
                        alt="${titleFormatted}"
                        class="h-12 w-16 rounded-lg object-cover shadow-sm shrink-0"
                    />
                    <div class="text-left pr-1">
                        <p class="text-xs font-bold text-gray-900 leading-tight">
                            ${titleFormatted}
                        </p>
                        <p class="text-[11px] text-gray-500">
                            ${listing.locality || "Gurgaon"}
                        </p>
                        <p class="mt-0.5 text-xs font-extrabold text-[#047857]">
                            ${priceFormatted}
                        </p>
                    </div>
                </div>
            `;

            marker.bindPopup(popupHtml, {
                className: "custom-ivy-popup",
                closeButton: false,
                offset: [0, -8],
            });

            marker.on("click", () => {
                onSelectListing(listing);
            });

            marker.addTo(markersLayer);
            markersMapRef.current.set(listing.listing_id, marker);
        });

        if (validCoords.length > 0) {
            const bounds = L.latLngBounds(validCoords);
            map.fitBounds(bounds, {
                padding: [40, 40],
                maxZoom: 13,
            });
        }
    }

    // Sync markers when listings change
    useEffect(() => {
        if (!mapInstanceRef.current || !markersLayerRef.current) {
            return;
        }

        import("leaflet").then((L) => {
            renderMarkers(L, mapInstanceRef.current, markersLayerRef.current);
        });
    }, [listings]);

    // Pan to selected marker
    useEffect(() => {
        if (!selectedListing || !mapInstanceRef.current) {
            return;
        }

        const marker = markersMapRef.current.get(selectedListing.listing_id);
        if (!marker) return;

        let lat = Number(selectedListing.latitude) || 28.4595;
        let lng = Number(selectedListing.longitude) || 77.0266;
        if (lat > 70 && lng < 35) {
            const temp = lat;
            lat = lng;
            lng = temp;
        }

        mapInstanceRef.current.panTo([lat, lng], {
            animate: true,
            duration: 0.6,
        });

        marker.openPopup();
    }, [selectedListing]);

    function handleZoomIn() {
        mapInstanceRef.current?.zoomIn();
    }

    function handleZoomOut() {
        mapInstanceRef.current?.zoomOut();
    }

    return (
        <div
            className={`relative h-full min-h-[600px] w-full overflow-hidden rounded-3xl border border-gray-100 bg-[#f5f6f8] shadow-sm ${className}`}
        >
            <div ref={mapContainerRef} className="h-full min-h-[600px] w-full z-0" />

            {/* Zoom Controls at Top Right (matching screenshot) */}
            <div className="absolute top-4 right-4 z-20 flex flex-col overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-md">
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

            {/* Floating Summary Card at Bottom (matching screenshot) */}
            <div className="absolute bottom-4 left-4 right-4 z-20">
                <SavedMapCard count={listings.length} />
            </div>
        </div>
    );
}

"use client";

import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type { Listing } from "@/types/listing";
import { getListingImage } from "@/lib/listing-images";
import { Plus, Minus } from "lucide-react";

import {
    formatIndianPrice,
    formatPropertyTitle,
    formatLocality,
} from "@/lib/formatters";

interface MapViewProps {
    listings: Listing[];
    selectedListing: Listing | null;
    onSelectListing: (listing: Listing) => void;
}

export function MapView({
    listings,
    selectedListing,
    onSelectListing,
}: MapViewProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markersLayerRef = useRef<any>(null);
    const markersMapRef = useRef<Map<string, any>>(new Map());

    // Initialize Leaflet map once
    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) return;

        let isMounted = true;

        import("leaflet").then((L) => {
            if (!isMounted || !mapContainerRef.current || mapInstanceRef.current) return;

            // Default center on Gurgaon: 28.4595, 77.0266
            const map = L.map(mapContainerRef.current, {
                center: [28.4595, 77.0266],
                zoom: 12,
                zoomControl: false,
            });

            // CartoDB Positron tiles for clean, light aesthetic matching mockup
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

            // Trigger initial render of markers
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

    // Render markers whenever listings change
    function renderMarkers(L: any, map: any, markersLayer: any) {
        if (!markersLayer) return;

        markersLayer.clearLayers();
        markersMapRef.current.clear();

        const validCoords: [number, number][] = [];

        listings.forEach((listing, index) => {
            const lat = Number(listing.latitude);
            const lng = Number(listing.longitude);

            if (Number.isNaN(lat) || Number.isNaN(lng)) return;

            validCoords.push([lat, lng]);

            const imageUrl = getListingImage(listing.listing_id, index);
            const title = formatPropertyTitle(listing.bedroom, listing.property_type);
            const locality = formatLocality(listing.locality);
            const price = formatIndianPrice(listing.price);

            // Custom green circular marker matching mockup
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

            // Mockup-style callout popup card
            const popupHtml = `
                <div class="flex items-center gap-3 p-1 font-sans cursor-pointer">
                    <img src="${imageUrl}" alt="${title}" class="h-12 w-16 rounded-lg object-cover shadow-sm shrink-0" />
                    <div class="text-left pr-1">
                        <p class="text-xs font-bold text-gray-900 leading-tight">${title}</p>
                        <p class="text-[11px] text-gray-500">${locality}</p>
                        <p class="mt-0.5 text-xs font-extrabold text-gray-950">${price}</p>
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

        // Fit map bounds if valid coordinates exist
        if (validCoords.length > 0) {
            const bounds = L.latLngBounds(validCoords);
            map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
        }
    }

    // Update markers when listings array changes
    useEffect(() => {
        if (!mapInstanceRef.current || !markersLayerRef.current) return;

        import("leaflet").then((L) => {
            renderMarkers(L, mapInstanceRef.current, markersLayerRef.current);
        });
    }, [listings]);

    // Pan to and open popup for selected listing
    useEffect(() => {
        if (!selectedListing || !mapInstanceRef.current) return;

        const marker = markersMapRef.current.get(selectedListing.listing_id);
        if (marker) {
            const lat = Number(selectedListing.latitude);
            const lng = Number(selectedListing.longitude);

            if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
                mapInstanceRef.current.panTo([lat, lng], {
                    animate: true,
                    duration: 0.6,
                });
                marker.openPopup();
            }
        }
    }, [selectedListing]);

    function handleZoomIn() {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.zoomIn();
        }
    }

    function handleZoomOut() {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.zoomOut();
        }
    }

    return (
        <div className="relative h-full min-h-[550px] w-full overflow-hidden rounded-3xl border border-gray-200 bg-[#f5f6f8] shadow-sm">
            {/* Map Container */}
            <div ref={mapContainerRef} className="h-full min-h-[550px] w-full z-0" />

            {/* Custom Floating Zoom Control Buttons (Bottom-Right) */}
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

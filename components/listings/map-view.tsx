"use client";

import React from "react";
import type { Listing } from "@/types/listing";
import { getListingImage } from "@/lib/listing-images";
import {
    formatIndianPrice,
    formatPropertyTitle,
    formatLocality,
} from "@/lib/formatters";
import { InteractiveMapView } from "@/components/common/interactive-map-view";

interface MapViewProps {
    listings: Listing[];
    selectedListing: Listing | null;
    onSelectListing: (listing: Listing) => void;
    className?: string;
}

export function MapView({
    listings,
    selectedListing,
    onSelectListing,
    className,
}: MapViewProps) {
    return (
        <InteractiveMapView<Listing>
            items={listings}
            selectedItem={selectedListing}
            onSelectItem={onSelectListing}
            getItemId={(l) => l.listing_id}
            getItemCoords={(l) => {
                const lat = Number(l.latitude);
                const lng = Number(l.longitude);
                return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null;
            }}
            getItemPopupData={(l, index) => ({
                title: formatPropertyTitle(l.bedroom, l.property_type),
                subtitle: formatLocality(l.locality),
                price: formatIndianPrice(l.price),
                imageUrl: getListingImage(l.listing_id, index),
            })}
            className={className}
        />
    );
}

"use client";

import React from "react";
import type { Rental } from "@/types/rental";
import { getListingImage } from "@/lib/listing-images";
import {
    formatIndianPrice,
    formatPropertyTitle,
    formatLocality,
} from "@/lib/formatters";
import { InteractiveMapView } from "@/components/common/interactive-map-view";

interface RentalMapViewProps {
    rentals: Rental[];
    selectedRental: Rental | null;
    onSelectRental: (rental: Rental) => void;
    className?: string;
}

export function RentalMapView({
    rentals,
    selectedRental,
    onSelectRental,
    className,
}: RentalMapViewProps) {
    return (
        <InteractiveMapView<Rental>
            items={rentals}
            selectedItem={selectedRental}
            onSelectItem={onSelectRental}
            getItemId={(r) => r.listing_id}
            getItemCoords={(r) => {
                const lat = Number(r.latitude);
                const lng = Number(r.longitude);
                return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null;
            }}
            getItemPopupData={(r, index) => ({
                title:
                    r.title ||
                    formatPropertyTitle(
                        r.bedroom,
                        r.property_type || "Apartment"
                    ),
                subtitle: formatLocality(r.locality),
                price: formatIndianPrice(r.price, true),
                imageUrl: getListingImage(r.listing_id, index),
            })}
            className={className}
        />
    );
}
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { Listing } from "@/types/listing";
import { getListingGallery } from "@/lib/constants/gallery";
import {
    formatIndianPrice,
    formatPropertyTitle,
    formatLocality,
    formatArea,
    formatFurnishing,
} from "@/lib/formatters";

export interface UseListingDetailReturn {
    listing: Listing | null;
    similarListings: Listing[];
    isLoading: boolean;
    error: string | null;
    galleryImages: string[];
    formattedPrice: string;
    propertyTitle: string;
    localityFormatted: string;
    carpetAreaStr: string;
    furnishingStr: string;
    floorStr: string;
    isRental: boolean;
    refetch: () => void;
}

function normalizeListing(item: Listing): Listing {
    let price = Math.abs(Number(item.price) || 0);
    // Fix scaled-down prices (6 listings divided by 1000 in raw data)
    if (price > 0 && price < 100000) {
        price = price * 1000;
    }

    // Fix MagicHomes area reported in square metres (~70-130 sqm -> sq ft)
    let carpet_area = Number(item.carpet_area) || 0;
    if ((item.website?.toLowerCase() === "magichomes" && carpet_area < 350) || (carpet_area > 0 && carpet_area < 300)) {
        carpet_area = Math.round(carpet_area * 10.7639);
    }

    let super_built_up_area = Number(item.super_built_up_area) || 0;
    if ((item.website?.toLowerCase() === "magichomes" && super_built_up_area < 450) || (super_built_up_area > 0 && super_built_up_area < 400)) {
        super_built_up_area = Math.round(super_built_up_area * 10.7639);
    }

    // Fix swapped coordinates anomaly in raw data (Lat > 70, Lng < 35)
    let latitude = Number(item.latitude);
    let longitude = Number(item.longitude);
    if (latitude > 70 && longitude < 35) {
        const temp = latitude;
        latitude = longitude;
        longitude = temp;
    }

    return {
        ...item,
        price,
        carpet_area,
        super_built_up_area,
        latitude,
        longitude,
    };
}

export function useListingDetail(listingId: string): UseListingDetailReturn {
    const [listing, setListing] = useState<Listing | null>(null);
    const [similarListings, setSimilarListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState<number>(0);

    const refetch = useCallback(() => {
        setReloadKey((prev) => prev + 1);
    }, []);

    // Stable curated gallery images
    const galleryImages = useMemo(() => {
        return getListingGallery(listingId);
    }, [listingId]);

    // Fetch primary listing and comparable properties
    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
        setError(null);

        fetch(`/api/listings/${encodeURIComponent(listingId)}`)
            .then(async (res) => {
                if (!res.ok) throw new Error(`Failed to load listing: ${res.status}`);
                return res.json();
            })
            .then((data: Listing) => {
                if (!isMounted) return;
                const normalized = normalizeListing(data);
                setListing(normalized);
                setIsLoading(false);

                // Fetch comparable listings
                fetch(`/api/listings/${encodeURIComponent(data.listing_id)}/similar`)
                    .then((r) => r.json())
                    .then((similarData) => {
                        if (!isMounted) return;
                        const items: Listing[] = Array.isArray(similarData)
                            ? similarData
                            : similarData.results || similarData.data || [];
                        setSimilarListings(items.map(normalizeListing).slice(0, 10));
                    })
                    .catch((err) => {
                        console.error("Failed to load similar listings:", err);
                    });
            })
            .catch((err) => {
                if (!isMounted) return;
                console.error("Listing load error:", err);
                setError(err.message || "Failed to load listing");
                setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [listingId, reloadKey]);

    // Formatted derivations
    const isRental =
        listing?.property_type?.toLowerCase().includes("rent") ||
        Number(listing?.price || 0) < 200000;

    const formattedPrice = formatIndianPrice(listing?.price, isRental);
    const propertyTitle = listing
        ? formatPropertyTitle(listing.bedroom, listing.property_type)
        : "Property Details";
    const localityFormatted = listing ? formatLocality(listing.locality, "Gurgaon") : "Gurgaon";
    const carpetAreaStr = listing ? formatArea(listing.carpet_area, listing.website) : "950 sq ft";
    const furnishingStr = listing ? formatFurnishing(listing.furnishing) : "Semi-Furnished";
    const floorStr =
        listing?.floor && listing?.total_floors
            ? `${listing.floor}th of ${listing.total_floors}`
            : listing?.floor
                ? `${listing.floor}th Floor`
                : "3rd of 5";

    return {
        listing,
        similarListings,
        isLoading,
        error,
        galleryImages,
        formattedPrice,
        propertyTitle,
        localityFormatted,
        carpetAreaStr,
        furnishingStr,
        floorStr,
        isRental,
        refetch,
    };
}

"use client";

import { useState, useEffect, useMemo } from "react";
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

export function useListingDetail(listingId: string): UseListingDetailReturn {
    const [listing, setListing] = useState<Listing | null>(null);
    const [similarListings, setSimilarListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    const refetch = () => setReloadKey((k) => k + 1);

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
                setListing(data);
                setIsLoading(false);

                // Fetch comparable listings
                fetch(`/api/listings/${encodeURIComponent(data.listing_id)}/similar`)
                    .then((r) => r.json())
                    .then((similarData) => {
                        if (!isMounted) return;
                        const items: Listing[] = Array.isArray(similarData)
                            ? similarData
                            : similarData.results || similarData.data || [];
                        setSimilarListings(items.slice(0, 10));
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
    const localityFormatted = listing ? formatLocality(listing.locality) : "Prayagraj";
    const carpetAreaStr = listing ? formatArea(listing.carpet_area) : "950 sq ft";
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

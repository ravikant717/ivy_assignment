"use client";

import { useState, useMemo } from "react";
import type { Listing } from "@/types/listing";
import type { SavedFilters } from "@/components/saved/saved-filter-sidebar";

export const INITIAL_SAVED_FILTERS: SavedFilters = {
    locality: "",
    propertyTypes: [],
    bedrooms: [],
    minPrice: "",
    maxPrice: "",
    furnishing: [],
};

export type SavedSortOption = "recent" | "price_asc" | "price_desc" | "bhk_desc";

export function useSavedFilters(favourites: Listing[]) {
    const [searchQuery, setSearchQuery] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [filters, setFilters] = useState<SavedFilters>(INITIAL_SAVED_FILTERS);
    const [sortOption, setSortOption] = useState<SavedSortOption>("recent");
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

    function handleSearchSubmit(e?: React.FormEvent) {
        if (e) e.preventDefault();
        setAppliedSearch(searchQuery.trim().toLowerCase());
    }

    function handleClearAll() {
        setFilters(INITIAL_SAVED_FILTERS);
        setSearchQuery("");
        setAppliedSearch("");
    }

    const filteredListings = useMemo(() => {
        let list = [...favourites];

        // 1. Text search query
        if (appliedSearch) {
            list = list.filter((item) => {
                const apt = item.apartment_name?.toLowerCase() ?? "";
                const loc = item.locality?.toLowerCase() ?? "";
                const desc = item.description?.toLowerCase() ?? "";
                const propType = item.property_type?.toLowerCase() ?? "";
                return (
                    apt.includes(appliedSearch) ||
                    loc.includes(appliedSearch) ||
                    desc.includes(appliedSearch) ||
                    propType.includes(appliedSearch)
                );
            });
        }

        // 2. Locality filter
        if (filters.locality.trim()) {
            const locQ = filters.locality.trim().toLowerCase();
            list = list.filter((item) =>
                (item.locality || "").toLowerCase().includes(locQ)
            );
        }

        // 3. Property Type filter
        if (filters.propertyTypes.length > 0) {
            list = list.filter((item) => {
                const itemType = (item.property_type || "").toLowerCase();
                return filters.propertyTypes.some((t) => itemType.includes(t));
            });
        }

        // 4. Bedroom filter
        if (filters.bedrooms.length > 0) {
            list = list.filter((item) => {
                const bed = Number(item.bedroom);
                return filters.bedrooms.some((b) => {
                    if (b === "4") return bed >= 4;
                    return bed === Number(b);
                });
            });
        }

        // 5. Price Min / Max filter
        const minP = Number(filters.minPrice);
        if (!isNaN(minP) && minP > 0) {
            list = list.filter((item) => Number(item.price) >= minP);
        }
        const maxP = Number(filters.maxPrice);
        if (!isNaN(maxP) && maxP > 0) {
            list = list.filter((item) => Number(item.price) <= maxP);
        }

        // 6. Furnishing filter
        if (filters.furnishing.length > 0) {
            list = list.filter((item) => {
                const itemFur = (item.furnishing || "").toLowerCase();
                return filters.furnishing.some((f) => itemFur.includes(f));
            });
        }

        // 7. Sorting
        if (sortOption === "price_asc") {
            list.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sortOption === "price_desc") {
            list.sort((a, b) => Number(b.price) - Number(a.price));
        } else if (sortOption === "bhk_desc") {
            list.sort((a, b) => Number(b.bedroom) - Number(a.bedroom));
        }

        return list;
    }, [favourites, appliedSearch, filters, sortOption]);

    return {
        searchQuery,
        setSearchQuery,
        appliedSearch,
        handleSearchSubmit,
        filters,
        setFilters,
        handleClearAll,
        sortOption,
        setSortOption,
        selectedListing,
        setSelectedListing,
        filteredListings,
    };
}

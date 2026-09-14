/**
 * Centralized filter constants and query mapping configurations.
 */

export const GURGAON_LOCALITIES = [
    "Sector 65",
    "Sector 82",
    "Golf Course Road",
    "DLF Phase 3",
    "Sohna Road",
    "New Gurgaon",
    "Dwarka Expressway",
    "MG Road",
    "Sector 49",
    "Sector 56",
] as const;

export const BEDROOM_OPTIONS = ["1", "2", "3", "4"] as const;

export const FURNISHING_OPTIONS = [
    { label: "Any Furnishing", value: "" },
    { label: "Furnished", value: "furnished" },
    { label: "Semi-furnished", value: "semi-furnished" },
    { label: "Unfurnished", value: "unfurnished" },
] as const;

export interface PriceFilterOption {
    value: string;
    label: string;
    minPrice?: number;
    maxPrice?: number;
}

export const PRICE_FILTER_OPTIONS: PriceFilterOption[] = [
    { value: "", label: "Any Price" },
    { value: "under-50l", label: "Under ₹50 Lakhs", minPrice: 0, maxPrice: 5000000 },
    { value: "50l-1cr", label: "₹50L – ₹1 Crore", minPrice: 5000000, maxPrice: 10000000 },
    { value: "1cr-2cr", label: "₹1 Crore – ₹2 Crores", minPrice: 10000000, maxPrice: 20000000 },
    { value: "above-2cr", label: "Above ₹2 Crores", minPrice: 20000000 },
    { value: "under-20k", label: "Under ₹20,000 / mo", minPrice: 0, maxPrice: 20000 },
    { value: "20k-40k", label: "₹20k – ₹40,000 / mo", minPrice: 20000, maxPrice: 40000 },
    { value: "40k-80k", label: "₹40k – ₹80,000 / mo", minPrice: 40000, maxPrice: 80000 },
];

export function getPriceRangeBounds(priceRangeKey: string): {
    minPrice?: number;
    maxPrice?: number;
} {
    const found = PRICE_FILTER_OPTIONS.find((opt) => opt.value === priceRangeKey);
    return {
        minPrice: found?.minPrice,
        maxPrice: found?.maxPrice,
    };
}

export type SortOption = "relevance" | "price-low" | "price-high" | "newest";

export interface SortConfig {
    value: SortOption;
    label: string;
    sortBy?: string;
    order?: "asc" | "desc";
}

export const SORT_CONFIGS: Record<SortOption, SortConfig> = {
    relevance: { value: "relevance", label: "Relevance" },
    "price-low": { value: "price-low", label: "Price: Low to High", sortBy: "price", order: "asc" },
    "price-high": { value: "price-high", label: "Price: High to Low", sortBy: "price", order: "desc" },
    newest: { value: "newest", label: "Newest First", sortBy: "posted_at", order: "desc" },
};

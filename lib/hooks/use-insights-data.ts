"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { AnalyticsSummary } from "@/lib/insights-data";
import { GURGAON_GROUNDED_ANALYTICS } from "@/lib/insights-data";

export interface InsightsFilters {
    location: string;
    propertyTypes: string[];
    bedrooms: string[];
    timeRange: string;
}

export const INITIAL_INSIGHTS_FILTERS: InsightsFilters = {
    location: "",
    propertyTypes: [],
    bedrooms: [],
    timeRange: "Last 6 months",
};

export type InsightsTab =
    | "Price Trends"
    | "Rental Trends"
    | "Demand & Supply"
    | "Top Localities";

export function useInsightsData() {
    const [data, setData] = useState<AnalyticsSummary>(GURGAON_GROUNDED_ANALYTICS);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCity, setSelectedCity] = useState("Gurgaon");
    const [activeTab, setActiveTab] = useState<InsightsTab>("Price Trends");
    const [chartPropertyType, setChartPropertyType] = useState("All");

    const [filters, setFilters] = useState<InsightsFilters>(INITIAL_INSIGHTS_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState<InsightsFilters>(INITIAL_INSIGHTS_FILTERS);

    const fetchSummary = useCallback(async (city: string) => {
        try {
            setIsLoading(true);
            const res = await fetch(`/v1/analytics/summary?city=${encodeURIComponent(city)}`);
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (err) {
            console.error("Failed to fetch analytics summary:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSummary(selectedCity);
    }, [selectedCity, fetchSummary]);

    function handleApplyFilters() {
        setAppliedFilters({ ...filters });
    }

    function handleClearFilters() {
        setFilters(INITIAL_INSIGHTS_FILTERS);
        setAppliedFilters(INITIAL_INSIGHTS_FILTERS);
    }

    const filteredLocalities = useMemo(() => {
        let locs = data.by_locality || [];
        if (appliedFilters.location.trim()) {
            const q = appliedFilters.location.toLowerCase().trim();
            locs = locs.filter(
                (l) =>
                    l.locality.toLowerCase().includes(q) ||
                    l.display_name.toLowerCase().includes(q)
            );
        }
        return locs;
    }, [data.by_locality, appliedFilters.location]);

    return {
        data,
        filteredLocalities,
        isLoading,
        selectedCity,
        setSelectedCity,
        activeTab,
        setActiveTab,
        chartPropertyType,
        setChartPropertyType,
        filters,
        setFilters,
        appliedFilters,
        handleApplyFilters,
        handleClearFilters,
    };
}


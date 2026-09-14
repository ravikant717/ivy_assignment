"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/listings/navbar";
import {
    InsightsHeader,
    InsightsKpiCards,
    InsightsTabs,
    PriceTrendChart,
    PropertyTypeDistribution,
    TopLocalitiesDemand,
    PriceHeatmap,
    InsightsBanner,
    InsightsDiscoveriesCard,
    DemandSupplyChart,
    TopLocalitiesView,
    BhkDistribution,
} from "@/components/insights";
import { useInsightsData } from "@/lib/hooks/use-insights-data";

export default function InsightsPage() {
    const {
        data,
        selectedCity,
        setSelectedCity,
        activeTab,
        setActiveTab,
        chartPropertyType,
        setChartPropertyType,
    } = useInsightsData();

    const [selectedLocality, setSelectedLocality] = useState<string | null>(null);

    const handleSelectLocality = (loc: string) => {
        setSelectedLocality((prev) => (prev === loc ? null : loc));
    };

    return (
        <div className="min-h-screen bg-[#fcfdfd] text-gray-900 flex flex-col">
            {/* Top Navigation */}
            <Navbar activeTab="insights" />

            {/* Main Insights Container */}
            <main className="mx-auto w-full max-w-[1536px] flex-1 px-4 py-6 sm:px-6 lg:px-8 space-y-6">
                {/* 1. Header with City Selector */}
                <InsightsHeader
                    city={selectedCity}
                    onCityChange={setSelectedCity}
                />

                {/* 2. Top 4 Metric KPI Cards */}
                <InsightsKpiCards data={data} />

                {/* 3. Tab Navigation */}
                <InsightsTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                {/* 4. Primary Interactive Visualizations (Charts & Map) */}
                {activeTab === "Top Localities" ? (
                    <div className="flex flex-col xl:flex-row gap-6 items-start">
                        <div className="flex-1 min-w-0 w-full">
                            <TopLocalitiesView
                                localities={data.by_locality}
                                selectedLocality={selectedLocality}
                                onSelectLocality={handleSelectLocality}
                            />
                        </div>
                        <div className="w-full xl:w-[420px] shrink-0">
                            <PriceHeatmap
                                localities={data.by_locality}
                                city={selectedCity}
                                selectedLocality={selectedLocality}
                                onSelectLocality={handleSelectLocality}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                        <div className="flex-1 min-w-0 w-full">
                            {activeTab === "Demand & Supply" ? (
                                <DemandSupplyChart
                                    trends={data.demand_supply_trends}
                                    bhkDemand={data.demand_by_bhk}
                                />
                            ) : (
                                <PriceTrendChart
                                    trends={
                                        activeTab === "Rental Trends"
                                            ? data.rental_trends
                                            : data.price_trends
                                    }
                                    isRent={activeTab === "Rental Trends"}
                                    propertyType={chartPropertyType}
                                    onPropertyTypeChange={setChartPropertyType}
                                    title={
                                        activeTab === "Rental Trends"
                                            ? "Average Rental Trends"
                                            : "Average Price Trends"
                                    }
                                    subtitle={
                                        activeTab === "Rental Trends"
                                            ? "Track how monthly rental rates have changed over time in Gurgaon."
                                            : "Track how property prices have changed over time in Gurgaon."
                                    }
                                />
                            )}
                        </div>

                        {/* Right Column: Price Heatmap Map */}
                        <div className="w-full lg:w-[400px] xl:w-[440px] shrink-0">
                            <PriceHeatmap
                                localities={data.by_locality}
                                city={selectedCity}
                                selectedLocality={selectedLocality}
                                onSelectLocality={handleSelectLocality}
                            />
                        </div>
                    </div>
                )}

                {/* 5. Dedicated Full-Width Analytics Breakdown Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* BHK Configuration Breakdown (by_bhk) */}
                    <BhkDistribution
                        items={data.by_bhk}
                        totalListings={data.total_listings}
                        city={selectedCity}
                    />

                    {/* Property Type Distribution Donut */}
                    <PropertyTypeDistribution
                        items={data.by_property_type}
                        totalListings={data.total_listings}
                        city={selectedCity}
                    />

                    {/* Top Localities by Demand (by_locality) */}
                    <TopLocalitiesDemand
                        localities={data.by_locality}
                        selectedLocality={selectedLocality}
                        onSelectLocality={handleSelectLocality}
                        onViewAll={() => setActiveTab("Top Localities")}
                    />
                </div>

                {/* 4. Data Discoveries & Audit Findings */}
                <InsightsDiscoveriesCard
                    discoveries={(data as any).discoveries}
                    city={selectedCity}
                />

                {/* 5. Bottom Information Banner */}
                <InsightsBanner />
            </main>
        </div>
    );
}

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

                {/* 3. Main Analytics Dashboard Layout */}
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Left/Main Column: Tabs + Dynamic Active Tab Content + Distribution + Demand */}
                    <div className="flex-1 min-w-0 space-y-6">
                        {/* Tab Navigation */}
                        <InsightsTabs
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />

                        {/* Interactive Tab View Switching */}
                        {activeTab === "Demand & Supply" ? (
                            <DemandSupplyChart
                                trends={data.demand_supply_trends}
                                bhkDemand={data.demand_by_bhk}
                            />
                        ) : activeTab === "Top Localities" ? (
                            <TopLocalitiesView
                                localities={data.by_locality}
                                selectedLocality={selectedLocality}
                                onSelectLocality={handleSelectLocality}
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

                        {/* Two Sub-Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Property Type Distribution Donut */}
                            <PropertyTypeDistribution
                                items={data.by_property_type}
                                totalListings={data.total_listings}
                                city={selectedCity}
                            />

                            {/* Top Localities by Demand */}
                            <TopLocalitiesDemand
                                localities={data.by_locality}
                                selectedLocality={selectedLocality}
                                onSelectLocality={handleSelectLocality}
                                onViewAll={() => setActiveTab("Top Localities")}
                            />
                        </div>
                    </div>

                    {/* Right Column: Price Heatmap Map */}
                    <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 self-stretch">
                        <PriceHeatmap
                            localities={data.by_locality}
                            city={selectedCity}
                            selectedLocality={selectedLocality}
                            onSelectLocality={handleSelectLocality}
                        />
                    </div>
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

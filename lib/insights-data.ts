export interface LocalityInsight {
    locality: string;
    display_name: string;
    count: number;
    rent_count?: number;
    total_units?: number;
    median_price: number;
    price_sqft: number;
    price_label: string;
    average_rent?: number;
    rental_yield?: number;
    searches: string;
    searches_num?: number;
    growth: number;
    lat: number;
    lng: number;
}

export interface PropertyTypeDistribution {
    type: string;
    percentage: number;
    count: number;
    color: string;
}

export interface BhkDistribution {
    bedroom: number;
    label: string;
    count: number;
    percentage: number;
}

export interface MonthlyTrend {
    month: string;
    year: string;
    label: string;
    price_sqft: number;
    rent_pm?: number;
}

export interface DemandSupplyTrend {
    month: string;
    year: string;
    label: string;
    supply: number;
    demand: number;
    ratio: number;
}

export interface DemandByBhk {
    label: string;
    supplyPct: number;
    demandPct: number;
    status: string;
}

export interface AnalyticsSummary {
    city: string;
    total_listings: number;
    median_price: number;
    median_price_per_sqft: number;
    average_price_sqft: number;
    price_growth_pct: number;
    average_rent: number;
    rent_growth_pct: number;
    total_listings_growth_pct: number;
    rental_yield: number;
    rental_yield_growth_pct: number;
    by_locality: LocalityInsight[];
    by_bhk: BhkDistribution[];
    by_property_type: PropertyTypeDistribution[];
    price_trends: MonthlyTrend[];
    rental_trends: MonthlyTrend[];
    demand_supply_trends?: DemandSupplyTrend[];
    demand_by_bhk?: DemandByBhk[];
}



export interface CorruptRecordDetail {
    id: string;
    floor: number;
    total_floors: number;
    carpet_area: number;
    price: number;
    locality: string;
    issue: string;
}

export interface DataDiscoveries {
    totalRecords: number;
    liveCount: number;
    livePct: number;
    inactiveCount: number;
    verifiedCount: number;
    verifiedPct: number;
    corruptCount: number;
    corruptRecords?: CorruptRecordDetail[];
    corruptIds?: string[];
    projectsTotal: number;
    projectsWithDiscrepancy: number;
    projectsDiscrepancyPct: number;
    costliestProject: {
        id: string;
        name: string;
        locality?: string;
        priceMinCr?: number;
        priceMaxCr: number;
    };
    medianBuyPriceCr: string;
    avgPriceSqft: number;
    avgRentPm: number;
    avgYieldPct: string;
}

import groundedRawData from "./grounded-raw-data.json";

export const GURGAON_GROUNDED_ANALYTICS = groundedRawData as unknown as AnalyticsSummary & {
    discoveries: DataDiscoveries;
};

export function computeInsightsFromRaw(): AnalyticsSummary & { discoveries: DataDiscoveries } {
    return GURGAON_GROUNDED_ANALYTICS;
}

export function getAnalyticsSummary(city: string = "gurgaon"): AnalyticsSummary & { discoveries?: DataDiscoveries } {
    return GURGAON_GROUNDED_ANALYTICS;
}


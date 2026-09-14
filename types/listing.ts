export interface Listing {
    listing_id: string;
    listing_url: string;
    website: string;

    city_id: number;

    apartment_name: string;
    locality: string;
    property_type: string;

    bedroom: number;
    bathroom: number;
    balcony: number;

    floor: number;
    total_floors: number;

    furnishing: string;
    facing_direction: string;

    covered_parking: number;

    price: number;
    carpet_area: number;
    super_built_up_area: number;

    latitude: number;
    longitude: number;

    posted_by: string;
    posted_by_name: string;
    posted_by_contact: string;

    project_id: string | null;

    is_verified: boolean;
    is_live: boolean;

    description: string;
    posted_at: string;
}
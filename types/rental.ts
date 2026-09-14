export type Rental = {
    listing_id: string;
    listing_url?: string;
    website?: string;

    city_id?: number;

    title?: string;
    apartment_name?: string;
    locality?: string;
    property_type?: string;

    bedroom?: number;
    bathroom?: number;

    floor?: number;
    total_floors?: number;

    furnishing?: string;
    facing_direction?: string;

    price: number;
    deposit?: number | null;
    maintenance?: number | null;

    carpet_area?: number | null;
    super_builtup_area?: number | null;

    latitude?: number | null;
    longitude?: number | null;

    posted_by?: string;
    posted_by_name?: string;

    description?: string;
    posted_at?: string;

    is_live?: boolean;
};

export type RentalsApiResponse = {
    results: Rental[];
    total?: number;
    count?: number;
    offset?: number;
    limit?: number;
    has_more: boolean;
};
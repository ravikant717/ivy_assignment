export type Project = {
    project_id: string;
    project_url?: string;
    city_id?: number;

    apartment_name?: string;
    developer_name?: string;
    locality?: string;
    project_status?: string;

    total_units?: number;
    total_towers?: number;
    total_floors?: number;

    launch_date?: string;
    possession_date?: string;
    rera_number?: string;

    min_area_sqft?: number | null;
    max_area_sqft?: number | null;

    amenities?: string[];

    latitude?: number | null;
    longitude?: number | null;

    total_listings?: number;

    price_min?: number | null;
    price_max?: number | null;
};

export type ProjectsApiResponse = {
    results: Project[];
    total?: number;
    count?: number;
    offset?: number;
    limit?: number;
    has_more: boolean;
};

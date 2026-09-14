/**
 * Data quality guards for physically impossible listing records.
 *
 * Finding (submission.json): 30 listings contain physically impossible data across
 * 5 categories of 6 records each. These are identified on RAW (pre-normalization)
 * field values and should be excluded from the public feed entirely.
 *
 * Categories:
 *  1. Negative prices          — price < 0
 *  2. Floor > total floors     — floor > total_floors (total_floors > 0)
 *  3. Carpet > super built-up  — carpet_area > super_built_up_area (both valid)
 *  4. Swapped coordinates      — raw lat > 76°N and lon < 29°E (Gurgaon is ~28°N / 77°E)
 *  5. 0-bedroom non-plot       — bedroom === 0 and property_type is not a plot
 */

interface RawListingFields {
    price?: number | string | null;
    floor?: number | null;
    total_floors?: number | null;
    carpet_area?: number | string | null;
    super_built_up_area?: number | string | null;
    latitude?: number | string | null;
    longitude?: number | string | null;
    bedroom?: number | null;
    property_type?: string | null;
    website?: string | null;
}

/**
 * Returns true if the raw listing record is physically impossible and should be
 * excluded from the listings feed. Must be called on raw API values BEFORE any
 * normalization (price scaling, sqm→sqft conversion, coordinate swapping).
 */
export function isCorruptListing(raw: RawListingFields): boolean {
    const price = Number(raw.price);
    const floor = Number(raw.floor);
    const totalFloors = Number(raw.total_floors);
    const lat = Number(raw.latitude);
    const lon = Number(raw.longitude);
    const bedroom = Number(raw.bedroom);
    const propType = (raw.property_type ?? "").toLowerCase();

    // 1. Negative price
    if (!isNaN(price) && price < 0) return true;

    // 2. Floor number exceeds total floors
    if (totalFloors > 0 && floor > totalFloors) return true;

    // 3. Carpet area exceeds super built-up area (both must be positive)
    const carpet = Number(raw.carpet_area);
    const sba = Number(raw.super_built_up_area);
    if (carpet > 0 && sba > 0 && carpet > sba) return true;

    // 4. Swapped coordinates: Gurgaon sits at ~28°N / 77°E.
    //    Swapped records have lat > 76° and lon < 29° (the values are in each other's field).
    if (!isNaN(lat) && !isNaN(lon) && lat > 76 && lon < 29) return true;

    // 5. Zero bedrooms on a non-plot property type
    if (bedroom === 0 && !propType.includes("plot")) return true;

    return false;
}

/**
 * Returns the specific physical impossibility reason if the listing is corrupt,
 * or null if valid.
 */
export function getCorruptionReason(raw: RawListingFields): string | null {
    const price = Number(raw.price);
    const floor = Number(raw.floor);
    const totalFloors = Number(raw.total_floors);
    const lat = Number(raw.latitude);
    const lon = Number(raw.longitude);
    const bedroom = Number(raw.bedroom);
    const propType = (raw.property_type ?? "").toLowerCase();
    const carpet = Number(raw.carpet_area);
    const sba = Number(raw.super_built_up_area);

    if (!isNaN(price) && price < 0) return "Negative price";
    if (totalFloors > 0 && floor > totalFloors) return `Floor (${floor}) exceeds total floors (${totalFloors})`;
    if (carpet > 0 && sba > 0 && carpet > sba) return `Carpet area (${carpet}) exceeds super built-up area (${sba})`;
    if (!isNaN(lat) && !isNaN(lon) && lat > 76 && lon < 29) return `Swapped latitude (${lat}) and longitude (${lon})`;
    if (bedroom === 0 && !propType.includes("plot")) return "0-bedroom apartment";

    return null;
}

/**
 * Centralized formatting utilities for property data, pricing, and geography.
 */

/**
 * Formats property price into Indian currency notation:
 * - Rentals: ₹18,000 / month
 * - Under 1 Lakh: ₹X,XXX
 * - 1 Lakh to 1 Crore: ₹XX.X L
 * - 1 Crore and above: ₹X.XX Cr
 * Automatically sanitizes negative price anomalies.
 */
export function formatIndianPrice(
    price: number | string | undefined | null,
    isRental?: boolean
): string {
    const rawNum = Number(price);
    if (price === undefined || price === null || Number.isNaN(rawNum)) {
        return "Price on Request";
    }

    const num = Math.abs(rawNum);
    if (num <= 0) return "Price on Request";

    const rental = isRental ?? num < 200000;

    if (rental) {
        return `₹${num.toLocaleString("en-IN")} / month`;
    }

    if (num >= 10000000) {
        const inCrores = (num / 10000000).toFixed(2).replace(/\.?0+$/, "");
        return `₹${inCrores} Cr`;
    }

    if (num >= 100000) {
        const inLakhs = (num / 100000).toFixed(1).replace(/\.?0+$/, "");
        return `₹${inLakhs} L`;
    }

    return `₹${num.toLocaleString("en-IN")}`;
}

/**
 * Formats BHK and property type into a clean, capitalized title:
 * e.g. "3 BHK Apartment", "4 BHK Independent House", "Villa"
 */
export function formatPropertyTitle(
    bedroom?: number | string | null,
    propertyType?: string | null
): string {
    const bhkNum = Number(bedroom);
    const bhkPrefix = !Number.isNaN(bhkNum) && bhkNum > 0 ? `${bhkNum} BHK ` : "";

    const rawType = propertyType?.trim() || "Apartment";
    const formattedType = rawType
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");

    return `${bhkPrefix}${formattedType}`;
}

/**
 * Formats locality name and ensures proper city suffix:
 * e.g. "sector 65" -> "Sector 65, Gurgaon"
 */
export function formatLocality(
    locality?: string | null,
    city: string = "Gurgaon"
): string {
    if (!locality || !locality.trim()) {
        return city;
    }

    const formattedLoc = locality
        .trim()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");

    return formattedLoc.toLowerCase().includes(city.toLowerCase())
        ? formattedLoc
        : `${formattedLoc}, ${city}`;
}

/**
 * Formats carpet area with sq ft suffix:
 * e.g. 1160 -> "1,160 sq ft"
 */
export function formatArea(carpetArea?: number | string | null): string {
    const num = Number(carpetArea);
    if (!carpetArea || Number.isNaN(num) || num <= 0) {
        return "Area on Request";
    }
    return `${num.toLocaleString("en-IN")} sq ft`;
}

/**
 * Formats furnishing string:
 * e.g. "semi-furnished" -> "Semi Furnished"
 */
export function formatFurnishing(furnishing?: string | null): string {
    if (!furnishing || !furnishing.trim()) {
        return "Not Specified";
    }
    return furnishing
        .trim()
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

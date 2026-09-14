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

    let num = Math.abs(rawNum);
    if (num <= 0) return "Price on Request";

    // For sale properties, fix 6 listings where price was scaled down by 1,000 in raw data
    if (!isRental && num > 0 && num < 100000) {
        num = num * 1000;
    }

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
 * Automatically normalizes MagicHomes sqm values (~70-130 sqm) to square feet.
 * e.g. 1160 -> "1,160 sq ft"
 */
export function formatArea(
    carpetArea?: number | string | null,
    website?: string | null
): string {
    const rawNum = Number(carpetArea);
    if (!carpetArea || Number.isNaN(rawNum) || rawNum <= 0) {
        return "Area on Request";
    }

    // Convert MagicHomes square metres (or suspicious < 300 sqm) to sq ft if not already converted
    const isSqm =
        (website?.toLowerCase() === "magichomes" && rawNum < 350) ||
        (rawNum < 300 && rawNum > 30);
    const num = isSqm ? Math.round(rawNum * 10.7639) : Math.round(rawNum);

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

/**
 * Formats a project price. Handles units where price < 10 is Crores,
 * 10 <= price < 1000 is Lakhs, and >= 100000 is raw rupees.
 */
export function formatProjectPrice(price?: number | null): string {
    if (price === undefined || price === null || Number.isNaN(Number(price)) || Number(price) <= 0) {
        return "Price on Request";
    }
    const num = Number(price);

    // If raw rupees (> 1,000,000)
    if (num >= 10000000) {
        return `₹${(num / 10000000).toFixed(2).replace(/\.?0+$/, "")} Cr`;
    }
    if (num >= 100000) {
        return `₹${(num / 100000).toFixed(1).replace(/\.?0+$/, "")} L`;
    }
    // If expressed in Lakhs (e.g. 78.9, 81.6, 94.6)
    if (num >= 10) {
        return `₹${num.toFixed(1).replace(/\.?0+$/, "")} L`;
    }
    // If expressed in Crores (e.g. 1.26, 1.66, 4.54)
    return `₹${num.toFixed(2).replace(/\.?0+$/, "")} Cr`;
}

/**
 * Formats min and max prices into a clean range:
 * e.g. "₹1.66 Cr – ₹4.54 Cr" or "₹81.6 L – ₹2.25 Cr"
 */
export function formatProjectPriceRange(
    minPrice?: number | null,
    maxPrice?: number | null
): string {
    const minStr = minPrice ? formatProjectPrice(minPrice) : null;
    const maxStr = maxPrice ? formatProjectPrice(maxPrice) : null;

    if (!minStr && !maxStr) return "Price on Request";
    if (minStr && maxStr && minStr !== maxStr) {
        return `${minStr} – ${maxStr}`;
    }
    return (minStr || maxStr)!;
}

/**
 * Formats min and max area into a clean sq ft range:
 * e.g. "1,223 – 2,718 sq ft"
 */
export function formatAreaRange(
    minArea?: number | null,
    maxArea?: number | null
): string {
    if (!minArea && !maxArea) return "Area on Request";
    if (minArea && maxArea && minArea !== maxArea) {
        return `${minArea.toLocaleString("en-IN")} – ${maxArea.toLocaleString("en-IN")} sq ft`;
    }
    const single = minArea || maxArea;
    return `${single!.toLocaleString("en-IN")} sq ft`;
}


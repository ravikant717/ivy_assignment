/**
 * Centralized formatting utilities for property data, pricing, and geography.
 */

/**
 * Normalizes listing prices in Indian Rupees (INR).
 *
 * Finding (submission.json):
 * Exactly 6 listing records have prices recorded in thousands of INR
 * (divided by 1000, e.g., 5200 instead of 52,00,000 for multi-bedroom properties).
 *
 * Evidence:
 *  - 100-6000578: 14620 -> 14,620,000 (2 BHK)
 *  - 100-6000678: 5030  -> 5,030,000  (1 BHK)
 *  - 100-6001599: 26260 -> 26,260,000 (5 BHK)
 *  - MAG-6002472: 8010  -> 8,010,000  (2 BHK)
 *  - MAG-6002941: 17250 -> 17,250,000 (5 BHK)
 *  - SQU-6000395: 17010 -> 17,010,000 (4 BHK)
 */
export function normalizeListingPrice(rawPrice: number | string | undefined | null): number {
    let price = Math.abs(Number(rawPrice) || 0);
    if (price > 0 && price < 100000) {
        price = price * 1000;
    }
    return price;
}

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
 * Normalizes property area measurements to square feet (sq ft).
 *
 * Finding (submission.json):
 * Listings from MagicHomes (website: magichomes) report areas in square metres
 * (approx. 70-140 sqm, < 350 sqm), requiring multiplication by 10.7639 for sq ft.
 * Listings that are already in sq ft (>= 350) or from other websites are preserved.
 *
 * Evidence:
 *  - MAG-6000002, MAG-6000014, MAG-6000030, MAG-6000055, MAG-6000434, MAG-6000794, MAG-6001288
 */
export function normalizeAreaToSqft(
    area?: number | string | null,
    website?: string | null
): number {
    const rawNum = Number(area);
    if (!area || Number.isNaN(rawNum) || rawNum <= 0) {
        return 0;
    }
    const isSqm =
        (website?.toLowerCase() === "magichomes" && rawNum < 350) ||
        (rawNum < 300 && rawNum > 30);
    return isSqm ? Math.round(rawNum * 10.7639) : Math.round(rawNum);
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
    const num = normalizeAreaToSqft(carpetArea, website);
    if (num <= 0) {
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

/**
 * Normalizes mixed-denomination project prices into true integers in Indian Rupees (INR).
 *
 * Finding (submission.json):
 * In /v1/projects, price_min and price_max are documented as integers in INR, but are
 * actually floats in mixed denominations:
 *  - values >= 10 are in Lakhs (x10^5)
 *  - values < 10 are in Crores (x10^7)
 *
 * Evidence projects:
 *  - P60004: price_min 94.6 (₹94.6 L) -> 9,460,000, price_max 2.15 (₹2.15 Cr) -> 21,500,000
 *  - P60006: price_min 1.58 (₹1.58 Cr) -> 15,800,000, price_max 4.64 (₹4.64 Cr) -> 46,400,000
 *  - P60008: price_min 1.36 (₹1.36 Cr) -> 13,600,000, price_max 2.59 (₹2.59 Cr) -> 25,900,000
 *  - P60009: price_min 88.2 (₹88.2 L) -> 8,820,000, price_max 1.88 (₹1.88 Cr) -> 18,800,000
 *  - P60060: price_min 1.57 (₹1.57 Cr) -> 15,700,000, price_max 5.83 (₹5.83 Cr) -> 58,300,000
 */
export function normalizeProjectPriceToRupees(raw?: number | null): number | null {
    if (raw === undefined || raw === null || Number.isNaN(Number(raw)) || Number(raw) <= 0) {
        return null;
    }
    const num = Number(raw);
    // Already in raw rupees (> 100,000)
    if (num >= 100000) {
        return Math.round(num);
    }
    // Values >= 10 are in Lakhs (x10^5)
    if (num >= 10) {
        return Math.round(num * 100000);
    }
    // Values < 10 are in Crores (x10^7)
    return Math.round(num * 10000000);
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

/**
 * Formats a listing's posted_at timestamp correctly.
 *
 * The API returns timestamps WITHOUT a timezone indicator (e.g. "2026-09-03T14:22:11"),
 * but they represent IST (UTC+05:30) — not UTC. Passing a bare ISO string to `new Date()`
 * makes JS treat it as UTC, shifting the time by -5h30m.
 *
 * Fix: append "+05:30" before parsing so the Date object holds the true instant.
 *
 * Examples:
 *   "2026-09-03T14:22:11"  → "3 Sep 2026"
 *   "2026-08-15T09:00:00"  → "15 Aug 2026"
 */
export function formatPostedAt(postedAt?: string | null): string {
    if (!postedAt) return "—";

    // Strip any existing trailing Z or offset, then re-attach the correct +05:30 offset
    const bare = postedAt.replace(/Z$/, "").replace(/[+-]\d{2}:\d{2}$/, "");
    const istString = `${bare}+05:30`;
    const date = new Date(istString);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata",
    });
}

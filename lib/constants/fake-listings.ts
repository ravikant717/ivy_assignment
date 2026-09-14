/**
 * Fraud detection constants for fake lead-generation listings.
 *
 * Finding (submission.json): 79 listings are clickbait bait with boilerplate
 * descriptions and ~35% below-market pricing. 69 of those 79 have is_verified: true,
 * making `is_verified` an unreliable fraud signal.
 *
 * Detection: match any of these phrases at the START of the description field.
 * Each phrase appears in exactly 22–31 listings (79 total).
 */
export const FAKE_LISTING_PHRASES = [
    "Owner moving abroad, priced to sell",
    "Urgent sale - owner relocating",
    "Price negotiable for a quick sale",
] as const;

/**
 * Returns true if a listing description matches a known fake boilerplate pattern.
 */
export function isFakeListing(description?: string | null): boolean {
    if (!description) return false;
    return FAKE_LISTING_PHRASES.some((phrase) => description.startsWith(phrase));
}

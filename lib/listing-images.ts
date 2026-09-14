/**
 * Curated high-resolution property photography matching modern apartments,
 * luxury independent houses, and villas for Gurgaon listings.
 */
export const PROPERTY_IMAGES = [
    // Bright modern apartment with floor-to-ceiling windows and sofa
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    // Modern independent white house with green lawn
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    // Elegant luxury living room with wood coffee table and beige couch
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
    // Modern Scandinavian style living room
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    // Contemporary urban apartment interior
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    // Beautiful suburban house exterior
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    // Cozy furnished apartment living space
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    // Minimalist villa living room
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
];

export function getListingImage(listingId: string | number, index: number = 0): string {
    const hash = String(listingId)
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return PROPERTY_IMAGES[(hash + index) % PROPERTY_IMAGES.length];
}

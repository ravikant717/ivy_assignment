// Curated 12 high-resolution photos matching luxury modern Indian apartments & architecture
export const GALLERY_PHOTOS: readonly string[] = [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=85", // Modern living room with floor-to-ceiling windows & sofa
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=85", // Elegant master bedroom with king bed
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=85", // Modern white modular kitchen
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85", // Sunny balcony with lush plants & skyline view
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85", // Luxury living room with wood table
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85", // Exterior facade with landscaped gardens
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1400&q=85", // Premium bathroom with glass shower
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=85", // Dining area with modern chandelier
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85", // Contemporary lounge seating
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=85", // Guest bedroom / study room
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85", // Grand clubhouse & entrance
    "https://images.unsplash.com/photo-1502005229762-ee1b2da973e6?auto=format&fit=crop&w=1400&q=85", // Cozy reading nook
];

/**
 * Returns a stable, deterministic set of photos for any given listing ID
 */
export function getListingGallery(listingId: string | number): string[] {
    const hash = String(listingId)
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return GALLERY_PHOTOS.map((_, i) => GALLERY_PHOTOS[(hash + i) % GALLERY_PHOTOS.length]);
}

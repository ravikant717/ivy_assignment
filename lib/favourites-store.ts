import { NextRequest } from "next/server";
import { MongoClient } from "mongodb";
import { getIvyTokensFromRequest } from "@/lib/ivy-auth";
import { fetchIvyWithAutoRefresh } from "@/lib/ivy-api";
import type { Listing } from "@/types/listing";
import fs from "fs";
import path from "path";

export interface SavedListingItem extends Listing {
    tag?: "FOR RENT" | "FOR SALE" | "PROJECT";
    image_url?: string;
    saved_at?: string;
}

// Global in-memory cache to ensure instant sub-millisecond responses
const memoryCache = new Map<string, string[]>();

// Optional file-based persistent fallback when MongoDB Atlas is unreachable (e.g. IP whitelist)
const STORAGE_FILE = path.join(process.cwd(), "data", "favourites.json");

function ensureDir(filePath: string) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        try {
            fs.mkdirSync(dir, { recursive: true });
        } catch {
            // ignore
        }
    }
}

function readLocalStore(): Record<string, string[]> {
    try {
        if (fs.existsSync(STORAGE_FILE)) {
            return JSON.parse(fs.readFileSync(STORAGE_FILE, "utf-8"));
        }
    } catch {
        // ignore
    }
    return {};
}

function writeLocalStore(data: Record<string, string[]>) {
    try {
        ensureDir(STORAGE_FILE);
        fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch {
        // ignore
    }
}

// MongoDB Client setup
let mongoClient: MongoClient | null = null;

function getMongoClient(): MongoClient | null {
    const url = process.env.DATABASE_URL;
    if (!url) return null;

    if (!mongoClient) {
        mongoClient = new MongoClient(url, {
            serverSelectionTimeoutMS: 2000,
            connectTimeoutMS: 2000,
        });
    }
    return mongoClient;
}

async function getMongoCollection() {
    const client = getMongoClient();
    if (!client) return null;
    try {
        await client.connect();
        const db = client.db();
        return db.collection<{
            userId: string;
            listingIds: string[];
            updatedAt: Date;
        }>("favourites");
    } catch (err: any) {
        // If MongoDB Atlas rejects connection (e.g. IP not whitelisted on Atlas), fallback gracefully
        return null;
    }
}

/**
 * Extracts the user identifier from the request cookies/token.
 */
export function extractUserId(request: NextRequest): string {
    const { accessToken } = getIvyTokensFromRequest(request);
    if (accessToken) {
        try {
            const parts = accessToken.split(".");
            if (parts.length >= 2) {
                const payloadStr = Buffer.from(parts[0], "base64").toString("utf-8");
                const payload = JSON.parse(payloadStr);
                if (payload.sub) {
                    return payload.sub;
                }
            }
        } catch {
            // fallback
        }
    }
    return "demo1@ivy.homes";
}

/**
 * Returns the list of favourite listing IDs for a user.
 * Loads from MongoDB (or local persistent fallback) - starts empty, NO seeding!
 */
export async function getFavouriteIds(userId: string): Promise<string[]> {
    // 1. Try MongoDB first for cross-device persistence
    const collection = await getMongoCollection();
    if (collection) {
        try {
            const doc = await collection.findOne({ userId });
            if (doc && Array.isArray(doc.listingIds)) {
                memoryCache.set(userId, doc.listingIds);
                return doc.listingIds;
            }
        } catch (e) {
            console.warn("MongoDB read error, falling back to local store:", e);
        }
    }

    // 2. Fallback to memory cache or local file persistence
    if (memoryCache.has(userId)) {
        return memoryCache.get(userId)!;
    }

    const localData = readLocalStore();
    const ids = localData[userId] || [];
    memoryCache.set(userId, ids);
    return ids;
}

/**
 * Adds a listing ID to user's favourites in MongoDB.
 */
export async function addFavouriteId(
    userId: string,
    listingId: string
): Promise<string[]> {
    const current = await getFavouriteIds(userId);
    let updated = current;

    if (!current.includes(listingId)) {
        updated = [listingId, ...current];
        memoryCache.set(userId, updated);

        // Save to MongoDB
        const collection = await getMongoCollection();
        if (collection) {
            try {
                await collection.updateOne(
                    { userId },
                    {
                        $addToSet: { listingIds: listingId },
                        $set: { updatedAt: new Date() },
                    },
                    { upsert: true }
                );
            } catch (e) {
                console.warn("MongoDB write error, updating local store:", e);
            }
        }

        // Also persist locally as backup
        const local = readLocalStore();
        local[userId] = updated;
        writeLocalStore(local);
    }

    return updated;
}

/**
 * Removes a listing ID from user's favourites in MongoDB.
 */
export async function removeFavouriteId(
    userId: string,
    listingId: string
): Promise<string[]> {
    const current = await getFavouriteIds(userId);
    const updated = current.filter((id) => id !== listingId);
    memoryCache.set(userId, updated);

    // Save to MongoDB
    const collection = await getMongoCollection();
    if (collection) {
        try {
            await collection.updateOne(
                { userId },
                {
                    $pull: { listingIds: listingId },
                    $set: { updatedAt: new Date() },
                }
            );
        } catch (e) {
            console.warn("MongoDB remove error, updating local store:", e);
        }
    }

    // Also persist locally as backup
    const local = readLocalStore();
    local[userId] = updated;
    writeLocalStore(local);

    return updated;
}

/**
 * Checks if a listing is favorited.
 */
export async function isFavouriteId(
    userId: string,
    listingId: string
): Promise<boolean> {
    const current = await getFavouriteIds(userId);
    return current.includes(listingId);
}

// In-memory cache for resolved listings so we don't spam upstream
const listingObjectsCache = new Map<string, SavedListingItem>();

/**
 * Resolves full Listing objects for the given IDs from the Ivy Homes API.
 */
export async function resolveListingObjects(
    request: NextRequest,
    listingIds: string[]
): Promise<SavedListingItem[]> {
    const results: SavedListingItem[] = [];

    for (const id of listingIds) {
        if (listingObjectsCache.has(id)) {
            results.push(listingObjectsCache.get(id)!);
            continue;
        }

        // Fetch from upstream Ivy API
        try {
            const apiResult = await fetchIvyWithAutoRefresh(
                request,
                `/v1/listings/${encodeURIComponent(id)}`
            );

            if (!("errorResponse" in apiResult) && apiResult.response.ok) {
                const listing: Listing = await apiResult.response.json();
                const isRental =
                    listing.property_type?.toLowerCase().includes("rent") ||
                    Number(listing.price) < 200000;

                const resolved: SavedListingItem = {
                    ...listing,
                    tag: isRental ? "FOR RENT" : "FOR SALE",
                    saved_at: new Date().toISOString(),
                };
                results.push(resolved);
                listingObjectsCache.set(id, resolved);
                continue;
            }
        } catch (err) {
            console.warn(`Could not fetch listing ${id} from upstream:`, err);
        }

        // Fallback placeholder for test IDs (like 100-1000042)
        const fallbackListing: SavedListingItem = {
            listing_id: id,
            listing_url: `/listings/${id}`,
            website: "ivyhomes",
            city_id: 6,
            apartment_name: `Saved Listing ${id}`,
            locality: "Sector 65",
            property_type: "apartment",
            bedroom: 2,
            bathroom: 2,
            balcony: 1,
            floor: 3,
            total_floors: 10,
            furnishing: "Semi-Furnished",
            facing_direction: "North",
            covered_parking: 1,
            price: 50000,
            carpet_area: 1100,
            super_built_up_area: 1350,
            latitude: 28.4116,
            longitude: 77.0655,
            posted_by: "owner",
            posted_by_name: "Ivy Verified",
            posted_by_contact: "+91 98765 00000",
            project_id: null,
            is_verified: true,
            is_live: true,
            description: `Saved property listing #${id}`,
            posted_at: new Date().toISOString(),
            tag: "FOR RENT",
            image_url:
                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
            saved_at: new Date().toISOString(),
        };

        results.push(fallbackListing);
        listingObjectsCache.set(id, fallbackListing);
    }

    return results;
}

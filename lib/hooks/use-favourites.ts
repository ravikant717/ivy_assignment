"use client";

import { useState, useEffect, useCallback } from "react";
import type { Listing } from "@/types/listing";

const FAVOURITES_EVENT = "ivy:favourites_updated";

export function useFavourites() {
    const [favourites, setFavourites] = useState<Listing[]>([]);
    const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFavourites = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/v1/favourites", { cache: "no-store" });
            if (!res.ok) {
                throw new Error(`Failed to fetch favourites: ${res.status}`);
            }
            const data = await res.json();
            const list: Listing[] = Array.isArray(data.results) ? data.results : [];
            setFavourites(list);
            setFavouriteIds(new Set(list.map((item) => item.listing_id)));
            setError(null);
        } catch (err: any) {
            console.error("useFavourites error:", err);
            setError(err.message || "Failed to load favourites");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFavourites();

        // Listen for updates from other components
        function handleSync() {
            fetchFavourites();
        }

        window.addEventListener(FAVOURITES_EVENT, handleSync);
        return () => {
            window.removeEventListener(FAVOURITES_EVENT, handleSync);
        };
    }, [fetchFavourites]);

    const notifyChange = useCallback(() => {
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent(FAVOURITES_EVENT));
        }
    }, []);

    const addFavourite = useCallback(
        async (listingId: string) => {
            setFavouriteIds((prev) => new Set([...prev, listingId]));
            try {
                const res = await fetch("/v1/favourites", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: listingId }),
                });
                if (!res.ok) {
                    throw new Error("Failed to save favourite");
                }
                notifyChange();
            } catch (err) {
                console.error("addFavourite error:", err);
                // Rollback
                setFavouriteIds((prev) => {
                    const next = new Set(prev);
                    next.delete(listingId);
                    return next;
                });
            }
        },
        [notifyChange]
    );

    const removeFavourite = useCallback(
        async (listingId: string) => {
            setFavouriteIds((prev) => {
                const next = new Set(prev);
                next.delete(listingId);
                return next;
            });
            setFavourites((prev) => prev.filter((item) => item.listing_id !== listingId));

            try {
                const res = await fetch(`/v1/favourites/${encodeURIComponent(listingId)}`, {
                    method: "DELETE",
                });
                if (!res.ok) {
                    throw new Error("Failed to remove favourite");
                }
                notifyChange();
            } catch (err) {
                console.error("removeFavourite error:", err);
                // Refetch on error to restore accurate state
                fetchFavourites();
            }
        },
        [fetchFavourites, notifyChange]
    );

    const toggleFavourite = useCallback(
        async (listingId: string) => {
            if (favouriteIds.has(listingId)) {
                await removeFavourite(listingId);
            } else {
                await addFavourite(listingId);
            }
        },
        [favouriteIds, addFavourite, removeFavourite]
    );

    const isFavourite = useCallback(
        (listingId: string) => favouriteIds.has(listingId),
        [favouriteIds]
    );

    return {
        favourites,
        favouriteIds,
        count: favouriteIds.size,
        isLoading,
        error,
        refetch: fetchFavourites,
        addFavourite,
        removeFavourite,
        toggleFavourite,
        isFavourite,
    };
}

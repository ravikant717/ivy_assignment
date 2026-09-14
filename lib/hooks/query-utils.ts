/**
 * Shared TanStack Query pagination and data normalization utilities.
 */

export interface OffsetPaginatedResponse<T> {
    results?: T[];
    total?: number;
    offset?: number;
    limit?: number;
    has_more?: boolean;
}

/**
 * Standard getNextPageParam for Ivy Homes offset/limit pagination.
 */
export function getNextOffsetPageParam(
    lastPage: OffsetPaginatedResponse<any>
): number | undefined {
    if (!lastPage?.has_more) {
        return undefined;
    }
    return (lastPage.offset ?? 0) + (lastPage.limit ?? 50);
}

/**
 * Flattens and deduplicates entities across infinite query pages by a specified ID key.
 */
export function deduplicatePagesById<T>(
    pages: OffsetPaginatedResponse<T>[] | undefined,
    idKey: keyof T,
    transform?: (item: T) => T
): T[] {
    if (!pages || pages.length === 0) return [];

    const seen = new Set<any>();
    const result: T[] = [];

    for (const page of pages) {
        if (!page.results) continue;
        for (const item of page.results) {
            const id = item[idKey];
            if (id !== undefined && id !== null && !seen.has(id)) {
                seen.add(id);
                result.push(transform ? transform(item) : item);
            }
        }
    }

    return result;
}

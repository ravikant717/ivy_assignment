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
 *
 * NOTE: Always pages on `has_more` rather than comparing `offset` to `total`.
 * The upstream API has known completeness discrepancies:
 *  - /v1/listings reports total: 3200, but continuing until `has_more: false` yields 3500 records (misses 300 records beyond offset 3200; 708 returned records have is_live: false).
 *  - /v1/projects reports total: 366, but continuing until `has_more: false` yields 400 records (misses P60367–P60400).
 *  - /v1/rentals reports total: 1207, but continuing until `has_more: false` yields 1320 records (misses R6001207–R6001320).
 * Halting at the reported total would prematurely cut off valid records.
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
 *
 * @param shouldSkip  Optional predicate applied to the RAW item before transform.
 *                    Return true to drop the item from the result entirely.
 *                    Use this for checks that rely on pre-normalization values
 *                    (e.g. negative prices, swapped coordinates).
 */
export function deduplicatePagesById<T>(
    pages: OffsetPaginatedResponse<T>[] | undefined,
    idKey: keyof T,
    transform?: (item: T) => T,
    shouldSkip?: (item: T) => boolean
): T[] {
    if (!pages || pages.length === 0) return [];

    const seen = new Set<any>();
    const result: T[] = [];

    for (const page of pages) {
        if (!page.results) continue;
        for (const item of page.results) {
            const id = item[idKey];
            if (id !== undefined && id !== null && !seen.has(id)) {
                // Drop corrupt/invalid records before spending time transforming them
                if (shouldSkip && shouldSkip(item)) continue;
                seen.add(id);
                result.push(transform ? transform(item) : item);
            }
        }
    }

    return result;
}

/**
 * Format a date string into localized date and time strings.
 * @param {string | Date | null | undefined} dateStr
 * @returns {{ date: string, time: string } | null}
 */
export function formatDateTime(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return null;
    return {
        date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
    };
}

/**
 * Format a date string as a localized date-only string (en-GB, "d MMM yyyy").
 * Falls back to "—" only for null/undefined/empty input (mirrors the original
 * per-page implementations this consolidates — does not guard against
 * otherwise-invalid date strings, to preserve their exact prior output).
 * @param {string | Date | null | undefined} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * Extract the YYYY-MM-DD portion from an ISO date string, for use as the
 * value of a plain HTML/date-input field. Returns "" for null/undefined.
 * @param {string | null | undefined} dateStr
 * @returns {string}
 */
export function toDateInputValue(dateStr) {
    if (!dateStr) return "";
    return dateStr.substring(0, 10);
}

/**
 * Build a URL query string from a params object.
 * Omits null, undefined, and empty-string values.
 * @param {Record<string, string | number | boolean | null | undefined>} params
 * @returns {string} e.g. "?page=1&limit=10"
 */
export function buildQueryString(params) {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== null && value !== undefined && value !== "") {
            qs.set(key, String(value));
        }
    }
    const str = qs.toString();
    return str ? `?${str}` : "";
}

/**
 * Merge API pagination response into local pagination state.
 * @param {object} localPagination  Current local pagination state.
 * @param {object | undefined} responsePagination  The pagination object from API response.
 * @returns {object}
 */
export function buildPagination(localPagination, responsePagination) {
    return {
        ...localPagination,
        totalRows: responsePagination?.totalItems ?? responsePagination?.total ?? 0,
        totalPages: responsePagination?.totalPages ?? 1,
        currentPage: responsePagination?.currentPage ?? responsePagination?.page ?? localPagination.currentPage,
    };
}

/**
 * Build an id → name lookup map from an array of objects.
 * @param {Array<{ id: string | number, name: string }>} items
 * @returns {Record<string | number, string>}
 */
export function buildIdNameMap(items = []) {
    const map = {};
    for (const item of items) {
        if (item?.id != null) map[item.id] = item.name;
    }
    return map;
}

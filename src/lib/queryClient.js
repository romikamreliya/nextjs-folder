import { QueryClient } from "@tanstack/react-query";

/**
 * Create a QueryClient instance with sensible defaults.
 * This is shared across the application.
 *
 * For applications showing real-time or frequently updated transactional data,
 * caching it risks showing stale figures, which is worse than the cost of an extra
 * request. So we intentionally do NOT cache by default: every query is always considered
 * stale and is evicted from the cache the moment nothing is using it, forcing every
 * mount, refocus, reconnect, and selection to hit the server fresh.
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Always considered stale — never silently serve a cached value as "fresh".
            staleTime: 0,
            // Evict from cache as soon as a query has no active observers (e.g. the
            // component unmounts, or a combobox selection moves to a different PO/ASN id).
            // Without this, a previously-fetched entry for the same key can stick around
            // and get reused on the next selection/mount instead of hitting the server.
            gcTime: 0,
            // Retry failed requests once
            retry: 0,
            // "always" bypasses the staleTime check entirely (plain `true` would still
            // skip the refetch if staleTime hadn't elapsed) — refetch unconditionally.
            // Window focus is excluded: switching browser tabs and coming back shouldn't
            // re-fire every API on the page — only an actual mount/navigation or
            // reconnect should force a fresh fetch.
            refetchOnWindowFocus: false,
            refetchOnMount: "always",
            refetchOnReconnect: "always",
        },
        mutations: {
            // Retry failed mutations once
            retry: 0,
        },
    },
});

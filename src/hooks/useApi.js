"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { get, post, put, patch, del } from "@/lib/api";

/**
 * Imperative GET for one-off, on-demand fetches inside event handlers (e.g. fetching
 * a record by a dynamic id selected by the user) where a declarative useGet query
 * isn't a fit. Pages/components should use this instead of importing `get` from
 * "@/lib/api" directly.
 *
 * @example
 * const detail = await fetchGet({ url: API_LIST.roles.getById + "/" + roleId });
 */
export function fetchGet(config) {
    return get(config);
}

/**
 * Custom hook for GET requests with caching
 *
 * @param {string|Array} queryKey - Unique key for caching
 * @param {string} url - API endpoint URL
 * @param {Object} [params={}] - Optional query parameters
 * @param {Object} [options={}] - Optional React Query options
 *
 * @example
 * const { data, isLoading, error } = useGet("users", "/users");
 * const { data } = useGet(["users", page], "/users", { page });
 * const { data } = useGet("me", "/me", {}, { enabled: isLoggedIn });
 */
export function useGet(queryKey, url, params = {}, options = {}) {
    if (!queryKey) throw new Error("useGet: `queryKey` is required");

    const isEnabled = !!url && options.enabled !== false;

    return useQuery({
        queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
        queryFn: () => {
            if (!url) throw new Error("useGet: `url` is required");
            return get({ url, params });
        },
        ...options,
        enabled: isEnabled,
    });
}

/**
 * Custom hook for POST requests
 *
 * @param {string} url - API endpoint URL
 * @param {boolean} [isFormData=false] - Send body as FormData
 * @param {Object} [options={}] - Optional React Query mutation options
 *
 * @example
 * const { mutate, isPending } = usePost({ url: "/users" });
 * mutate({ name: "John", email: "john@example.com" });
 *
 * const { mutate } = usePost("/upload", true);
 */
export function usePost(url, options = {}) {
    if (!url) throw new Error("usePost: `url` is required");
    const { isFormData, ...mutationOptions } = options;
    return useMutation({
        mutationFn: (body) => post({ url, body, isFormData }),
        onSuccess: (data, variables, context) => {
            options.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
            options.onError?.(error, variables, context);
        },
        ...mutationOptions,
    });
}

/**
 * Custom hook for PUT requests (full update)
 *
 * @param {string} url - API endpoint URL
 * @param {boolean} [isFormData=false] - Send body as FormData
 * @param {Object} [options={}] - Optional React Query mutation options
 *
 * @example
 * const { mutate, isPending } = usePut({ url: "/users/1" });
 * mutate({ name: "Updated Name", email: "new@example.com" });
 */
export function usePut(url, options = {}) {
    if (!url) throw new Error("usePut: `url` is required");
    const { isFormData, ...mutationOptions } = options;
    return useMutation({
        mutationFn: (body) => put({ url, body, isFormData }),
        onSuccess: (data, variables, context) => {
            options.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
            options.onError?.(error, variables, context);
        },
        ...mutationOptions,
    });
}

/**
 * Custom hook for PATCH requests (partial update)
 *
 * @param {string} url - API endpoint URL
 * @param {boolean} [isFormData=false] - Send body as FormData
 * @param {Object} [options={}] - Optional React Query mutation options
 *
 * @example
 * const { mutate } = usePatch({ url: "/users/1" });
 * mutate({ name: "Updated Name" });
 */
export function usePatch(url, options = {}) {
    const isUrlString = typeof url === "string";
    const actualUrl = isUrlString ? url : null;
    const actualOptions = isUrlString ? options : (url || {});
    const { isFormData, ...mutationOptions } = actualOptions;

    return useMutation({
        mutationFn: (variables) => {
            const requestUrl = (variables && typeof variables === "object" && "url" in variables) ? variables.url : actualUrl;
            const requestBody = (variables && typeof variables === "object" && "body" in variables) ? variables.body : variables;

            if (!requestUrl) throw new Error("usePatch: `url` is required");
            return patch({ url: requestUrl, body: requestBody, isFormData });
        },
        onSuccess: (data, variables, context) => {
            actualOptions.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
            actualOptions.onError?.(error, variables, context);
        },
        ...mutationOptions,
    });
}

/**
 * Custom hook for DELETE requests
 *
 * @param {string} url - API endpoint URL
 * @param {Object} [options={}] - Optional React Query mutation options
 *
 * @example
 * const { mutate, isPending } = useDelete("/users/1");
 * mutate();
 */
export function useDelete(url, options = {}) {
    if (!url) throw new Error("useDelete: `url` is required");

    return useMutation({
        mutationFn: () => del({ url }),
        onSuccess: (data, variables, context) => {
            options.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
            options.onError?.(error, variables, context);
        },
        ...options,
    });
}


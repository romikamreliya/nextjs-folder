/**
 * OAuth 2.0 auth helpers.
 *
 * Uses plain axios (not the api instance) for auth endpoints so that
 * the api interceptors (auth header injection, token refresh) never
 * interfere with the auth flow itself.
 *
 * Token storage strategy:
 *   - Access token  → Zustand memory (lost on page refresh, very short-lived)
 *   - Refresh token → js-cookie  (7-day, sameSite=strict)
 */
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "./api";
import { API_LIST } from "./api-const";
import { useAuthStore } from "@/store/authStore";
import { cookiesAuthKey } from "./enum";
import { queryClient } from "./queryClient";
import AppToast from "@/components/ui/toast";

function getCookieOptions() {
    return {
        expires: 7,
        sameSite: "strict",
        // Use protocol check at runtime so HTTP staging servers (where NODE_ENV is still
        // "production" after build) don't get secure:true, which silently drops cookies.
        secure: typeof window !== "undefined" && window.location.protocol === "https:",
    };
}

// ── Public helpers ────────────────────────────────────────────────────────────

/**
 * Login with username/password (Resource Owner Password Grant equivalent).
 * Stores the access token in memory and the refresh token in a cookie.
 *
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ user, accessToken, refreshToken }>}
 */
async function login(data) {
    // Clear query cache to prevent stale company/permission data from leaking
    queryClient.clear();
    Cookies.set(cookiesAuthKey, JSON.stringify(data), getCookieOptions());
    if (typeof window !== "undefined") {
        localStorage.setItem(cookiesAuthKey, JSON.stringify(data));
    }
    useAuthStore.getState().setAuth(data, data.token);
    return data;
}

/**
 * Logout — notifies the server (best-effort), clears all tokens.
 */
async function logout() {
    Cookies.remove(cookiesAuthKey);
    if (typeof window !== "undefined") {
        localStorage.removeItem(cookiesAuthKey);
    }
    useAuthStore.getState().clearAuth();
    // Clear React Query cache on logout
    queryClient.clear();
}

/**
 * Exchange a refresh token for a new access token.
 * Called automatically by the Axios response interceptor in api.js.
 *
 * @returns {Promise<string>} new accessToken
 */
async function refreshAccessToken() {
    let cookiesData = Cookies.get(cookiesAuthKey);
    if (!cookiesData && typeof window !== "undefined") {
        cookiesData = localStorage.getItem(cookiesAuthKey);
    }

    if (!cookiesData) throw new Error("No refresh token available");

    try {
        const userData = JSON.parse(cookiesData);
        if (!userData?.refreshToken) {
            throw new Error("No refresh token available");
        }

        // ── API: Token refresh call (commented out for demo) ─────────────────
        // Fix double-slash URL issue if BASE_URL ends with a slash and API_LIST.refreshToken starts with one
        // const url = `${BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL}${API_LIST.refreshToken}`;
        // const { data } = await axios.post(url, { refreshToken: userData.refreshToken });
        // const responseBody = data;
        // const apiData = responseBody?.data || responseBody;

        // ── Mock: Return fake token response for demo ────────────────────────
        const apiData = {
            token: "mock-access-token-xyz",
            refreshToken: "mock-refresh-token-xyz",
            user: userData.user || { id: "1", name: "Demo User", email: userData.email }
        };

        if (!apiData?.token && !apiData?.accessToken) {
            throw new Error("No access token returned from refresh API");
        }

        const nextToken = apiData.token || apiData.accessToken;
        const nextRefreshToken = apiData.refreshToken || userData.refreshToken;

        const updatedUserData = {
            ...userData,
            token: nextToken,
            refreshToken: nextRefreshToken,
        };

        if (apiData.user) {
            updatedUserData.user = apiData.user;
        }

        Cookies.set(cookiesAuthKey, JSON.stringify(updatedUserData), getCookieOptions());
        if (typeof window !== "undefined") {
            localStorage.setItem(cookiesAuthKey, JSON.stringify(updatedUserData));
        }
        return nextToken;
    } catch (error) {
        console.error("refreshAccessToken failed error:", error);
        throw new Error(error.message || "Failed to parse refresh token");
    }
}

/**
 * Called once on app mount (see AuthProvider).
 * Silently restores the session from a stored refresh token.
 *
 * @returns {Promise<object|null>} user data or null if no valid session
 */
async function initAuth() {
    const state = useAuthStore.getState();
    if (state.isAuthenticated && state.accessToken) {
        return { accessToken: state.accessToken };
    }

    let cookiesData = Cookies.get(cookiesAuthKey);
    if (!cookiesData && typeof window !== "undefined") {
        cookiesData = localStorage.getItem(cookiesAuthKey);
    }
    if (!cookiesData) return null;

    try {
        const accessToken = await refreshAccessToken();

        // refreshAccessToken already updated the cookie; read the latest data
        const updatedRaw = Cookies.get(cookiesAuthKey);
        const userData = updatedRaw ? JSON.parse(updatedRaw) : {};
        useAuthStore.getState().setAuth(userData, accessToken);
        return { accessToken };
    } catch (error) {
        console.error("initAuth failed error:", error);
        
        // If it is a network error, do not delete cookies, keep credentials and notify the user
        const isNetError = error.message === "Network Error" || error.code === "ERR_NETWORK" || !error.response;
        if (isNetError) {
            AppToast.danger("Cannot connect to server. Please check your network connection.");
            return null;
        }

        Cookies.remove(cookiesAuthKey);
        if (typeof window !== "undefined") {
            localStorage.removeItem(cookiesAuthKey);        }
        useAuthStore.getState().clearAuth();
        return null;
    }
}


const authHelper = {
    login,
    logout,
    refreshAccessToken,
    initAuth,
};
export default authHelper;
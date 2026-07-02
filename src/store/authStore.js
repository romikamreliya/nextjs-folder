import { create } from "zustand";

function readLocalStorage(key) {
    try {
        if (typeof window === "undefined") return null;
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

/**
 * Auth store — holds access token in memory (not localStorage).
 * Refresh token lives in a cookie (set by lib/auth.js).
 *
 * Outside React components use .getState() / .setState() directly.
 * Inside components use the hook: const { user } = useAuthStore();
 */
export const useAuthStore = create((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    companies: [],
    currentCompany: readLocalStorage("currentCompany"),
    countries: [],
    currentCountry: readLocalStorage("currentCountry"),

    setAuth: (user, accessToken) => set({ user, accessToken, isAuthenticated: true }),

    setAccessToken: (accessToken) => set({ accessToken }),

    clearAuth: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("currentCompany");
            localStorage.removeItem("currentCountry");
        }
        set({ user: null, accessToken: null, isAuthenticated: false, companies: [], currentCompany: null, countries: [], currentCountry: null });
    },

    setCompanies: (companies) => set({ companies }),

    setCurrentCompany: (company) => {
        if (typeof window !== "undefined") {
            if (company) {
                localStorage.setItem("currentCompany", JSON.stringify(company));
            } else {
                localStorage.removeItem("currentCompany");
            }
        }
        set({ currentCompany: company });
    },

    setCountries: (countries) => set({ countries }),

    setCurrentCountry: (country) => {
        if (typeof window !== "undefined") {
            if (country) {
                localStorage.setItem("currentCountry", JSON.stringify(country));
            } else {
                localStorage.removeItem("currentCountry");
            }
        }
        set({ currentCountry: country });
    },
}));

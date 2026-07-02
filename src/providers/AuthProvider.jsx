"use client";

import { useEffect, useState } from "react";
import auth from "@/lib/auth";
// import { useGet } from "@/hooks/useApi";
// import { API_LIST } from "@/lib/api-const";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";
import { Buildings } from "@/components/icon/icons";
import { Spinner } from "@heroui/react";

// ── Mock Data (replace with API calls for production) ────────────────────────
const MOCK_COMPANIES = [
    { id: "1", name: "Demo Company" },
];

const MOCK_COUNTRIES = [
    { id: "us", countryCode: "US", countryName: "United States" },
    { id: "fr", countryCode: "FR", countryName: "France" },
];

/**
 * Restores the user session on every page refresh by exchanging
 * the stored refresh token cookie for a new access token.
 *
 * Renders nothing until the check is complete to prevent
 * authenticated routes flashing before the redirect.
 */
export function AuthProvider({ children }) {
    const [ready, setReady] = useState(false);
    const { isAuthenticated, companies, setCompanies, setCurrentCompany, setCountries, setCurrentCountry } = useAuthStore();
    const { logout } = useAuth();

    useEffect(() => {
        auth.initAuth().finally(() => setReady(true));
    }, []);

    // ── API: Fetch user's companies (commented out for demo) ───────────────
    // const { 
    //     data: companiesRes, 
    //     isSuccess: isCompaniesSuccess, 
    //     isError, 
    //     error, 
    //     refetch, 
    //     isFetching 
    // } = useGet(
    //     ["getMyCompanies"],
    //     API_LIST.getMyCompanies,
    //     {},
    //     { enabled: ready && isAuthenticated }
    // );

    // ── Mock: Use fixed company data for demo ─────────────────────────────
    const isCompaniesSuccess = ready && isAuthenticated;
    const isError = false;
    const error = null;
    const isFetching = false;
    const refetch = () => {};

    const hasError = isError || (isCompaniesSuccess && companies.length === 0);
    const showLoading = !ready

    useEffect(() => {
        if (!isCompaniesSuccess) return;

        // ── Mock: Use fixed company data instead of API response ──────────
        const companiesList = MOCK_COMPANIES;
        setCompanies(companiesList);

        let companyToSelect = null;
        if (typeof window !== "undefined") {
            const savedCompany = localStorage.getItem("currentCompany");
            if (savedCompany) {
                try {
                    const parsed = JSON.parse(savedCompany);
                    companyToSelect = companiesList.find((c) => c.id === parsed.id) || null;
                } catch (e) {
                    console.error("Failed to parse saved company", e);
                }
            }
        }

        if (!companyToSelect && companiesList.length > 0) {
            companyToSelect = companiesList[0];
        }

        if (companyToSelect) {
            setCurrentCompany(companyToSelect);
        }

        // ── Mock: Use fixed country data for demo ─────────────────────────
        const countriesList = MOCK_COUNTRIES;
        setCountries(countriesList);

        let countryToSelect = null;
        if (typeof window !== "undefined") {
            const savedCountry = localStorage.getItem("currentCountry");
            if (savedCountry) {
                try {
                    const parsed = JSON.parse(savedCountry);
                    countryToSelect = countriesList.find((c) => c.id === parsed.id) || null;
                } catch (e) {
                    console.error("Failed to parse saved country", e);
                }
            }
        }

        if (!countryToSelect && countriesList.length > 0) {
            countryToSelect = countriesList[0];
        }

        if (countryToSelect) {
            setCurrentCountry(countryToSelect);
        }
    }, [isCompaniesSuccess, setCompanies, setCurrentCompany, setCountries, setCurrentCountry]);

    if (showLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-(--color-bg)">
                <Spinner size="lg" color="primary" />
            </div>
        );
    }

    if (ready && isAuthenticated && hasError) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-(--color-bg) to-(--color-bg-subtle)">
                <div className="w-full max-w-md bg-(--color-surface) border border-(--color-border) rounded-2xl p-6 sm:p-8 shadow-(--shadow-lg) flex flex-col items-center text-center animate-fade-in-up">
                    
                    {/* Error Icon Circle */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 text-red-500 mb-6">
                        <Buildings className="h-8 w-8" />
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-(--color-text-primary) tracking-tight mb-2">
                        {isError ? "Connection Error" : "No Company Context Found"}
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-text-secondary leading-relaxed mb-8 max-w-sm">
                        {isError 
                            ? (error?.message || "Failed to retrieve your associated companies. Please check your network connection and try again.")
                            : "You have no company, so you cannot access any data."
                        }
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <button
                            onClick={() => refetch()}
                            disabled={isFetching}
                            className="flex-1 h-11 flex items-center justify-center rounded-xl bg-(--color-btn-primary) text-(--color-btn-primary-text) hover:bg-(--color-btn-primary-hover) disabled:opacity-50 transition-all font-semibold text-sm cursor-pointer"
                        >
                            {isFetching ? "Retrying..." : "Retry"}
                        </button>
                        <button
                            onClick={logout}
                            className="flex-1 h-11 flex items-center justify-center rounded-xl bg-(--color-btn-secondary) text-(--color-btn-secondary-text) border border-(--color-btn-secondary-border) hover:bg-(--color-btn-secondary-hover) transition-all font-semibold text-sm cursor-pointer"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return children;
}

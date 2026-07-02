"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import auth from "@/lib/auth";

/**
 * Primary auth hook — use this in components.
 *
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 *
 * // Login form submit
 * await login({ email, password });
 *
 * // Logout button
 * await logout();
 */
export function useAuth() {
    const router = useRouter();

    const handleLogin = useCallback(
        async (credentials) => {
            const data = await auth.login(credentials);
            router.replace("/dashboard"); // adjust to your main authenticated route
            return data;
        },
        [router]
    );

    const handleLogout = useCallback(async () => {
        await auth.logout();
        router.replace("/login");
    }, [router]);

    return {
        login: handleLogin,
        logout: handleLogout,
    };
}

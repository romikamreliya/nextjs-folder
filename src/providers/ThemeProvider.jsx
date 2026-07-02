"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";

const THEME_STORAGE_KEY = "app-theme-mode";
const THEME_REVEAL_CLASS = "theme-page-transition";
const ThemeContext = createContext(null);

function resolveThemePreference(preferredTheme) {
    if (preferredTheme === "dark" || preferredTheme === "light") return preferredTheme;
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveInitialTheme() {
    if (typeof window === "undefined") return "light";

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "light" || storedTheme === "dark" || storedTheme === "system") return storedTheme;

    return "system";
}

function applyTheme(mode, resolvedTheme, shouldTransition) {
    if (typeof document === "undefined") return;

    const activeTheme = resolvedTheme ?? resolveThemePreference(mode);
    const isDark = activeTheme === "dark";

    if (shouldTransition) {
        document.documentElement.classList.add("theme-transitioning");
    }

    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("light", !isDark);
    document.documentElement.dataset.theme = activeTheme;

    if (shouldTransition) {
        setTimeout(() => {
            document.documentElement.classList.remove("theme-transitioning");
        }, 350);
    }
}

function getRevealRadius(x, y) {
    if (typeof window === "undefined") return 0;

    return Math.max(
        Math.hypot(x, y),
        Math.hypot(window.innerWidth - x, y),
        Math.hypot(x, window.innerHeight - y),
        Math.hypot(window.innerWidth - x, window.innerHeight - y),
    );
}

function clearRevealState(root) {
    root.classList.remove(THEME_REVEAL_CLASS, "theme-page-transition-to-light", "theme-page-transition-to-dark");
    root.style.removeProperty("--theme-transition-x");
    root.style.removeProperty("--theme-transition-y");
    root.style.removeProperty("--theme-transition-radius");
}

export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState(() => resolveInitialTheme());
    const [systemTheme, setSystemTheme] = useState(() => resolveThemePreference("system"));
    const [isMounted, setIsMounted] = useState(false);
    const skipTransitionEffectRef = useRef(false);

    const resolvedTheme = useMemo(() => (
        theme === "system" ? systemTheme : theme
    ), [theme, systemTheme]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const shouldTransition = isMounted && !skipTransitionEffectRef.current;
        applyTheme(theme, resolvedTheme, shouldTransition);
        skipTransitionEffectRef.current = false;
    }, [theme, resolvedTheme, isMounted]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleSystemThemeChange = (event) => {
            const nextResolved = event.matches ? "dark" : "light";
            setSystemTheme(nextResolved);
        };

        mediaQuery.addEventListener("change", handleSystemThemeChange);
        return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }, []);

    const setTheme = useCallback((nextTheme, options = {}) => {
        if (nextTheme !== "light" && nextTheme !== "dark" && nextTheme !== "system") return;

        const nextResolvedTheme = nextTheme === "system" ? systemTheme : nextTheme;
        const shouldAnimate = nextResolvedTheme !== resolvedTheme
            && typeof document !== "undefined"
            && typeof window !== "undefined"
            && typeof document.startViewTransition === "function"
            && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (shouldAnimate) {
            const root = document.documentElement;
            const originX = typeof options.originX === "number" ? options.originX : window.innerWidth - 36;
            const originY = typeof options.originY === "number" ? options.originY : 36;
            const revealRadius = getRevealRadius(originX, originY);

            root.style.setProperty("--theme-transition-x", `${originX}px`);
            root.style.setProperty("--theme-transition-y", `${originY}px`);
            root.style.setProperty("--theme-transition-radius", `${revealRadius}px`);
            root.classList.add(
                THEME_REVEAL_CLASS,
                nextResolvedTheme === "dark" ? "theme-page-transition-to-dark" : "theme-page-transition-to-light",
            );

            skipTransitionEffectRef.current = true;

            const transition = document.startViewTransition(() => {
                flushSync(() => {
                    setThemeState(nextTheme);
                });
                applyTheme(nextTheme, nextResolvedTheme, false);
            });

            transition.finished.finally(() => {
                clearRevealState(root);
            });
        } else {
            setThemeState(nextTheme);
        }

        if (typeof window !== "undefined") {
            window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        }
    }, [resolvedTheme, systemTheme]);

    const toggleTheme = useCallback((options = {}) => {
        setTheme((resolvedTheme === "dark" ? "light" : "dark"), options);
    }, [resolvedTheme, setTheme]);

    const value = useMemo(() => ({
        theme,
        resolvedTheme,
        isDark: resolvedTheme === "dark",
        setTheme,
        toggleTheme,
    }), [theme, resolvedTheme, setTheme, toggleTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeMode() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useThemeMode must be used within ThemeProvider");
    return context;
}

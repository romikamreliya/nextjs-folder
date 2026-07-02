"use client";

import { Tooltip } from "@heroui/react";
import { Moon, Sun } from "@/components/icon/icons";
import { useThemeMode } from "@/providers/ThemeProvider";

export default function ThemeToggle() {
    const { isDark, toggleTheme } = useThemeMode();

    const handleToggle = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        toggleTheme({
            originX: rect.left + (rect.width / 2),
            originY: rect.top + (rect.height / 2),
        });
    };

    return (
        <Tooltip content={isDark ? "Switch to light mode" : "Switch to dark mode"}>
            <button
                type="button"
                onClick={handleToggle}
                aria-label={isDark ? "Enable light mode" : "Enable dark mode"}
                className="theme-toggle-entry theme-toggle-button inline-flex"
            >
                <span className={`theme-toggle-track ${isDark ? "is-dark" : ""}`}>
                    <span className={`theme-toggle-thumb ${isDark ? "is-dark" : ""}`} />
                    <Sun className={`theme-toggle-icon sun ${isDark ? "is-hidden" : ""}`} />
                    <Moon className={`theme-toggle-icon moon ${isDark ? "" : "is-hidden"}`} />
                </span>
            </button>
        </Tooltip>
    );
}

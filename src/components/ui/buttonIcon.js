"use client";

import React from "react";
import { Tooltip } from "@heroui/react";

export default function AppButtonIcon({
    icon,
    onClick,
    className = "",
    title = "",
    disabled = false,
    ...props
}) {
    if (!icon) {
        throw new Error("Button icon is required");
    }

    // Dynamic semantic action color classes
    const getActionColors = (text) => {
        const lower = text.toLowerCase().trim();
        if (lower.includes("view")) {
            // View should NOT be colored (keep it default gray)
            return "text-text-secondary hover:bg-surface-hover hover:text-(--color-text-primary)";
        }
        if (lower.includes("edit") || lower.includes("update")) {
            return "text-amber-500 dark:text-amber-400 hover:bg-amber-500/10 dark:hover:bg-amber-400/10 hover:text-amber-600 dark:hover:text-amber-300";
        }
        if (lower.includes("post") || lower.includes("submit") || lower.includes("verify") || lower.includes("approve")) {
            return "text-blue-500 dark:text-blue-400 hover:bg-blue-500/10 dark:hover:bg-blue-400/10 hover:text-blue-600 dark:hover:text-blue-300";
        }
        if (lower.includes("cancel") || lower.includes("delete") || lower.includes("reject")) {
            return "text-red-500 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-400/10 hover:text-red-600 dark:hover:text-red-300";
        }
        if (lower.includes("print") || lower.includes("download") || lower.includes("history")) {
            return "text-violet-500 dark:text-violet-400 hover:bg-violet-500/10 dark:hover:bg-violet-400/10 hover:text-violet-600 dark:hover:text-violet-300";
        }
        return "text-text-secondary hover:bg-surface-hover hover:text-(--color-text-primary)";
    };

    const actionColors = getActionColors(title);

    const buttonEl = (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center justify-center ${className || `h-7 w-7 rounded-full border border-border-subtle bg-surface-subtle transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${actionColors}`}`}
            {...props}
        >
            {icon}
        </button>
    );

    const getTooltipContent = (text) => {
        const lowerText = text.toLowerCase().trim();
        let dotColor = "bg-zinc-400 shadow-zinc-400/50";

        if (lowerText.includes("view")) {
            dotColor = "bg-sky-400 shadow-sky-400/50";
        } else if (lowerText.includes("edit") || lowerText.includes("update")) {
            dotColor = "bg-amber-400 shadow-amber-400/50";
        } else if (lowerText.includes("post") || lowerText.includes("submit") || lowerText.includes("verify") || lowerText.includes("approve")) {
            dotColor = "bg-emerald-400 shadow-emerald-400/50";
        } else if (lowerText.includes("cancel") || lowerText.includes("delete") || lowerText.includes("reject")) {
            dotColor = "bg-rose-500 shadow-rose-500/50";
        } else if (lowerText.includes("print") || lowerText.includes("download") || lowerText.includes("history")) {
            dotColor = "bg-violet-400 shadow-violet-400/50";
        }

        return (
            <div className="flex items-center gap-2 py-0.5 px-0.5">
                <span className={`h-1.5 w-1.5 rounded-full ${dotColor} shadow-[0_0_6px] shrink-0`} />
                <span className="text-[10px] font-extrabold tracking-widest uppercase !text-zinc-100 dark:!text-zinc-50 font-sans leading-none">
                    {text}
                </span>
            </div>
        );
    };

    const buttonWithTooltip = title ? (
        <Tooltip 
            showArrow={true} 
            placement="top" 
            offset={12}
            delay={100}
            closeDelay={0}
            radius="md"
            motionProps={{
                variants: {
                    exit: {
                        opacity: 0,
                        scale: 0.85,
                        transition: {
                            duration: 0.1,
                            ease: "easeIn",
                        }
                    },
                    enter: {
                        opacity: 1,
                        scale: 1,
                        transition: {
                            duration: 0.15,
                            ease: "easeOut",
                        }
                    }
                }
            }}
        >
            <Tooltip.Trigger>{buttonEl}</Tooltip.Trigger>
            <Tooltip.Content 
                style={{ 
                    backgroundColor: "#09090b", 
                    color: "#fafafa",
                    "--tooltip-background": "#09090b",
                    "--tooltip-bg": "#09090b",
                    "--heroui-tooltip-bg": "#09090b"
                }}
                className="py-1 px-2.5 !backdrop-blur-md !border !border-[#27272a] !rounded-md !shadow-[0_8px_30px_rgb(0,0,0,0.5)]"
            >
                {getTooltipContent(title)}
            </Tooltip.Content>
        </Tooltip>
    ) : (
        buttonEl
    );

    return buttonWithTooltip;
}
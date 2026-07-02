"use client";

import React from "react";

export default function HighlightText({
    text,
    query,
    className = "",
    highlightClassName = "",
    fadedClassName = "",
}) {
    const str = String(text ?? "");
    const search = query?.trim();

    if (!search) {
        return (
            <span className={className}>
                {str}
            </span>
        );
    }

    const escaped = search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

    const regex = new RegExp(`(${escaped})`, "gi");

    const parts = str.split(regex);

    return (
        <span className={className}>
            {parts.map((part, index) => {
                const isMatch =
                    part.toLowerCase() ===
                    search.toLowerCase();

                return (
                    <span
                        key={index}
                        className={
                            isMatch
                                ? `
                                    font-semibold
                                    text-(--color-text-primary)
                                    ${highlightClassName}
                                  `
                                : `
                                    text-(--color-text-muted)
                                    ${fadedClassName}
                                  `
                        }
                    >
                        {part}
                    </span>
                );
            })}
        </span>
    );
}
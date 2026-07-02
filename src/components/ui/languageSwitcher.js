"use client";

import React from "react";
import {
    Dropdown,
    DropdownTrigger,
    DropdownPopover,
    DropdownMenu,
    DropdownItem,
} from "@heroui/react";
import { useLocale } from "@/hooks/useTranslation";

const LANGUAGES = [
    { code: "en", label: "English",  countryCode: "us" },
    { code: "fr", label: "Français", countryCode: "fr" },
];

function Flag({ countryCode, size = "sm" }) {
    const width = size === "sm" ? 22 : 28;
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={`https://flagcdn.com/w40/${countryCode}.png`}
            width={width}
            alt={countryCode}
            className="rounded-sm object-cover shrink-0 shadow-sm"
            style={{ aspectRatio: "4/3" }}
        />
    );
}

export default function LanguageSwitcher() {
    const { locale, changeLocale } = useLocale();
    const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

    return (
        <Dropdown>
            <DropdownTrigger>
                <div
                    role="button"
                    tabIndex={0}
                    className="flex items-center gap-1.5 cursor-pointer px-2 py-1.5 rounded-(--radius-lg) hover:bg-(--color-hover) transition-colors shrink-0"
                    aria-label="Switch language"
                >
                    <Flag countryCode={current.countryCode} size="sm" />
                    <span className="hidden sm:inline text-[11px] font-bold uppercase tracking-wider text-(--color-text-secondary) leading-none">
                        {current.code}
                    </span>
                </div>
            </DropdownTrigger>

            <DropdownPopover>
                <DropdownMenu
                    selectionMode="single"
                    selectedKeys={[locale]}
                    onAction={(key) => changeLocale(String(key))}
                    className="min-w-44"
                >
                    <Dropdown.Section>
                        {LANGUAGES.map((lang) => (
                            <DropdownItem key={lang.code} id={lang.code} className="py-2.5">
                                <div className="flex items-center gap-3">
                                    <Flag countryCode={lang.countryCode} size="lg" />
                                    <span className="font-semibold text-sm tracking-wide">
                                        {lang.label}
                                    </span>
                                    <Dropdown.ItemIndicator />
                                </div>
                            </DropdownItem>
                        ))}
                    </Dropdown.Section>
                </DropdownMenu>
            </DropdownPopover>
        </Dropdown>
    );
}

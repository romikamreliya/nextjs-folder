"use client";

import React, { useState } from "react";
import {
    Dropdown,
    DropdownTrigger,
    DropdownPopover,
    DropdownMenu,
    DropdownItem,
    Tooltip,
} from "@heroui/react";
import { Globe, AltArrowDown } from "@/components/icon/icons";
import { useAuthStore } from "@/store/authStore";
import { useTranslation } from "@/hooks/useTranslation";

function CountryFlag({ countryCode, countryName, size = "sm" }) {
    const [hasError, setHasError] = useState(false);
    const width = size === "sm" ? 22 : 28;
    
    if (!countryCode || hasError) {
        return (
            <div className={`flex items-center justify-center ${size === "sm" ? "size-5 text-[10px]" : "size-7.5 text-xs"} rounded-full bg-(--color-bg-subtle) text-(--color-text-secondary) font-extrabold shadow-sm shrink-0 border border-(--color-border)`}>
                {countryName?.[0]?.toUpperCase() || countryCode?.[0]?.toUpperCase() || <Globe className="size-3.5" />}
            </div>
        );
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
            width={width}
            alt={countryName || countryCode}
            onError={() => setHasError(true)}
            className="rounded-sm object-cover shrink-0 shadow-sm border border-black/5 dark:border-white/5"
            style={{ aspectRatio: "4/3" }}
        />
    );
}

export default function CountrySwitcher() {
    const { t } = useTranslation("common");
    const { countries, currentCountry, setCurrentCountry } = useAuthStore();

    if (!countries || countries.length === 0) {
        return null;
    }

    const isSingleCountry = countries.length === 1;

    const handleCountryChange = (countryId) => {
        const selected = countries.find((c) => c.id === countryId);
        if (selected) {
            setCurrentCountry(selected);
        }
    };

    const triggerContent = (
        <Tooltip content={`${t("topbar.country") ?? "Company Country"}: ${currentCountry?.countryName || (t("topbar.switchCountry") ?? "Select Company Country")}`} closeDelay={0}>
            <div
                {...(!isSingleCountry && {
                    role: "button",
                    tabIndex: 0,
                    "aria-label": "Switch country"
                })}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-(--radius-lg) select-none shrink-0 ${
                    isSingleCountry
                        ? ""
                        : "cursor-pointer hover:bg-(--color-hover) active:bg-(--color-active) transition-all duration-200"
                }`}
            >
                <CountryFlag countryCode={currentCountry?.countryCode} countryName={currentCountry?.countryName} size="sm" />
                <div className="hidden sm:flex flex-col text-left leading-none">
                    <span className="text-[9px] font-extrabold text-(--color-text-muted) uppercase tracking-wider">
                        {t("topbar.country") ?? "Company Country"}
                    </span>
                    <span className="text-xs font-bold text-(--color-text-primary) mt-0.5">
                        {currentCountry?.countryName || (t("topbar.switchCountry") ?? "Select Company Country")}
                    </span>
                </div>
                <span className="inline sm:hidden text-[11px] font-bold uppercase tracking-wider text-(--color-text-secondary) leading-none">
                    {currentCountry?.countryCode || "OM"}
                </span>
                {!isSingleCountry && (
                    <AltArrowDown className="size-3.5 text-(--color-text-muted) transition-transform duration-200" />
                )}
            </div>
        </Tooltip>
    );

    if (isSingleCountry) {
        return triggerContent;
    }

    return (
        <Dropdown>
            <DropdownTrigger>
                {triggerContent}
            </DropdownTrigger>

            <DropdownPopover>
                <DropdownMenu
                    selectionMode="single"
                    selectedKeys={currentCountry ? new Set([currentCountry.id]) : new Set()}
                    onAction={(key) => handleCountryChange(String(key))}
                    className="min-w-52"
                >
                    <Dropdown.Section title={t("topbar.switchCountry") ?? "Switch Country"}>
                        {countries.map((country) => (
                            <DropdownItem key={country.id} id={country.id} className="py-2 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <CountryFlag countryCode={country.countryCode} countryName={country.countryName} size="sm" />
                                    <span className="font-semibold text-sm tracking-wide truncate max-w-44 text-(--color-text-primary)">
                                        {country.countryName}
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

"use client";

import React from "react";
import {
    Dropdown,
    DropdownTrigger,
    DropdownPopover,
    DropdownMenu,
    DropdownItem,
} from "@heroui/react";
import { Buildings, AltArrowDown } from "@/components/icon/icons";
import { useAuthStore } from "@/store/authStore";
import { useTranslation } from "@/hooks/useTranslation";

export default function CompanySwitcher() {
    const { t } = useTranslation("common");
    const { companies, currentCompany, setCurrentCompany } = useAuthStore();

    if (!companies || companies.length === 0) {
        return null;
    }

    const isSingleCompany = companies.length === 1;

    const handleCompanyChange = (companyId) => {
        const selected = companies.find((c) => c.id === companyId);
        if (selected) {
            setCurrentCompany(selected);
        }
    };

    const triggerContent = (
        <div
            {...(!isSingleCompany && {
                role: "button",
                tabIndex: 0,
                "aria-label": "Switch company"
            })}
            className={`flex w-full items-center gap-3 p-2 rounded-xl select-none min-w-0 ${
                isSingleCompany
                    ? ""
                    : "cursor-pointer hover:bg-(--color-hover) active:bg-(--color-active) transition-all duration-200"
            }`}
        >
            {/* Theme-aligned Avatar circle */}
            <div className="flex items-center justify-center size-9 rounded-full bg-(--color-btn-primary) text-(--color-btn-primary-text) font-extrabold text-sm shadow-sm shrink-0 border border-white/5">
                {currentCompany?.name?.[0]?.toUpperCase() || "C"}
            </div>
            
            {/* Company Information */}
            <div className="flex flex-col text-left min-w-0 flex-1">
                <span className="text-[10px] font-extrabold text-(--color-text-muted) uppercase tracking-widest leading-none">
                    {t("topbar.company")}
                </span>
                <span className="text-sm font-bold text-(--color-text-primary) tracking-tight truncate mt-1 leading-none">
                    {currentCompany?.name || "Select Company"}
                </span>
            </div>
            
            {/* Clean Arrow indicator wrapper (hidden if single company) */}
            {!isSingleCompany && (
                <div className="size-5 rounded-md flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0">
                    <AltArrowDown className="size-3.5 text-(--color-text-muted)" />
                </div>
            )}
        </div>
    );

    if (isSingleCompany) {
        return triggerContent;
    }

    return (
        <Dropdown className="w-full">
            <DropdownTrigger className="w-full">
                {triggerContent}
            </DropdownTrigger>

            <DropdownPopover>
                <DropdownMenu
                    selectionMode="single"
                    selectedKeys={currentCompany ? new Set([currentCompany.id]) : new Set()}
                    onAction={(key) => handleCompanyChange(String(key))}
                    className="min-w-60"
                >
                    <Dropdown.Section title={t("topbar.switchCompany")}>
                        {companies.map((company) => (
                            <DropdownItem key={company.id} id={company.id} className="py-2.5 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center size-7.5 rounded-full bg-(--color-btn-primary) text-(--color-btn-primary-text) font-extrabold text-[11px] uppercase tracking-wider shrink-0 shadow-xs border border-white/5">
                                        {company.name?.[0]?.toUpperCase() || "C"}
                                    </div>
                                    <span className="font-semibold text-sm tracking-wide truncate max-w-44 text-(--color-text-primary)">
                                        {company.name}
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

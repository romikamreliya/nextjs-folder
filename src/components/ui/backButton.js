"use client";

import React from "react";
import { ArrowLeftDuotone } from "@/components/icon/icons";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

export default function BackButton({ onClick, fallbackUrl = "/" }) {
    const router = useRouter();
    const { t } = useTranslation(["common"]);

    const handleNavigate = () => {
        if (onClick) {
            onClick();
        } else {
            router.push(fallbackUrl);
        }
    };

    return (
        <button
            type="button"
            onClick={handleNavigate}
            className="inline-flex items-center justify-center gap-2 h-10 px-6 rounded-lg text-sm font-semibold bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 border border-zinc-900 dark:border-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer"
        >
            <ArrowLeftDuotone className="text-base shrink-0" />
            {t("common:actions.backToList") || "Back To List"}
        </button>
    );
}

"use client";

import { useTranslation } from "@/hooks/useTranslation";

export default function DashboardPage() {
    const { t } = useTranslation("dashboard");
    return (
        <>
            <h1>{t("page.title")}</h1>
        </>
    );
}
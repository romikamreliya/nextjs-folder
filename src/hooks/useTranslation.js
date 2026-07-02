"use client";

import { useCallback } from "react";
import { useI18n } from "@/providers/I18nProvider";
import { t as coreT } from "@/lib/i18n";

const RTL_LANGUAGES = ["ar", "he", "fa", "ur"];

export function useTranslation(ns = "common") {
    const { locale, changeLocale } = useI18n();
    const defaultNs = Array.isArray(ns) ? ns[0] : ns;

    const t = useCallback(
        (key, params) => coreT(key.includes(":") ? key : `${defaultNs}:${key}`, params),
        [defaultNs]
    );

    const isRTL = RTL_LANGUAGES.includes(locale);

    return {
        t,
        locale,
        dir: isRTL ? "rtl" : "ltr",
        isRTL,
        changeLocale,
        i18n: { language: locale, changeLanguage: changeLocale },
    };
}

// Alias for components that only need locale helpers
export const useLocale = useTranslation;

"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { getLocale, setLocale as coreSetLocale } from "@/lib/i18n";

const RTL_LANGUAGES = ["ar", "he", "fa", "ur"];
const I18nContext = createContext(null);

export function I18nProvider({ children }) {
    const [locale, setLocaleState] = useState(getLocale);

    useEffect(() => {
        const lng = getLocale();
        document.documentElement.lang = lng;
        document.documentElement.dir = RTL_LANGUAGES.includes(lng) ? "rtl" : "ltr";
    }, []);

    const changeLocale = useCallback((lng) => {
        coreSetLocale(lng);
        setLocaleState(lng);
    }, []);

    return (
        <I18nContext.Provider value={{ locale, changeLocale }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error("useI18n must be used within I18nProvider");
    return ctx;
}

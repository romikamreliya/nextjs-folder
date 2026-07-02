import en from "@/locales/en.json";
import fr from "@/locales/fr.json";

const translations = { en, fr };

const STORAGE_KEY = "app-lang";
const RTL_LANGUAGES = ["ar", "he", "fa", "ur"];
const SUPPORTED = Object.keys(translations);

let currentLocale = "en";

if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) {
        currentLocale = stored;
    } else {
        const browserLang = navigator?.language?.slice(0, 2);
        if (browserLang && SUPPORTED.includes(browserLang)) {
            currentLocale = browserLang;
        }
    }
}

function resolve(locale, namespace, keyPath) {
    const parts = keyPath.split(".");
    let value = translations[locale]?.[namespace];
    for (const part of parts) {
        if (value == null || typeof value !== "object") return undefined;
        value = value[part];
    }
    return typeof value === "string" ? value : undefined;
}

export function t(key, params = {}) {
    let namespace = "common";
    let keyPath = key;
    if (key.includes(":")) {
        const idx = key.indexOf(":");
        namespace = key.slice(0, idx);
        keyPath = key.slice(idx + 1);
    }
    const value =
        resolve(currentLocale, namespace, keyPath) ??
        resolve("en", namespace, keyPath) ??
        key;
    return value.replace(/\{\{(\w+)\}\}/g, (_, k) =>
        params[k] !== undefined ? String(params[k]) : `{{${k}}}`
    );
}

export function getLocale() {
    return currentLocale;
}

export function setLocale(lng) {
    if (!SUPPORTED.includes(lng)) return;
    currentLocale = lng;
    if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, lng);
        document.documentElement.lang = lng;
        document.documentElement.dir = RTL_LANGUAGES.includes(lng) ? "rtl" : "ltr";
    }
}

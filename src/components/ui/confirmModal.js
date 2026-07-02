"use client";

import { useEffect } from "react";
import AppButton from "@/components/ui/button";

export default function AppConfirmModal({
    isOpen = false,
    onClose,
    onConfirm,
    title = "Confirm",
    description = "Are you sure you want to proceed?",
    itemName,
    loading = false,
    cancelText = "Cancel",
    confirmText = "Confirm",
    itemIcon: ItemIcon,
    itemLabel = "Item",
    variant = "primary", // "primary" (blue), "danger" (red), "success" (green), "warning" (orange), "info" (sky)
    icon: IconComponent,
    confirmIcon,
}) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // Theme mappings based on variant
    const themeMap = {
        primary: {
            bg: "bg-blue-50 dark:bg-blue-950/30",
            border: "border-blue-100 dark:border-blue-900/50",
            text: "text-blue-500 dark:text-blue-400",
            btnVariant: "primary"
        },
        success: {
            bg: "bg-emerald-50 dark:bg-emerald-950/30",
            border: "border-emerald-100 dark:border-emerald-900/50",
            text: "text-emerald-500 dark:text-emerald-400",
            btnVariant: "primary"
        },
        warning: {
            bg: "bg-amber-50 dark:bg-amber-950/30",
            border: "border-amber-100 dark:border-amber-900/50",
            text: "text-amber-500 dark:text-amber-400",
            btnVariant: "primary"
        },
        danger: {
            bg: "bg-rose-50 dark:bg-rose-950/30",
            border: "border-rose-100 dark:border-rose-900/50",
            text: "text-rose-500 dark:text-rose-400",
            btnVariant: "danger"
        },
        info: {
            bg: "bg-sky-50 dark:bg-sky-950/30",
            border: "border-sky-100 dark:border-sky-900/50",
            text: "text-sky-500 dark:text-sky-400",
            btnVariant: "primary"
        }
    };

    const theme = themeMap[variant] || themeMap.primary;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={!loading ? onClose : undefined}
                aria-hidden="true"
            />

            {/* Modal Card */}
            <div className="relative z-10 w-full max-w-sm rounded-3xl bg-(--color-surface) border border-(--color-border-subtle) shadow-xl p-6 animate-fade-in-up">

                {/* Icon */}
                {IconComponent && (
                    <div className="flex justify-center mb-5">
                        <div className={`flex items-center justify-center w-16 h-16 rounded-full ${theme.bg} border ${theme.border}`}>
                            <IconComponent className={`text-3xl ${theme.text}`} />
                        </div>
                    </div>
                )}

                {/* Title */}
                <h3
                    id="confirm-modal-title"
                    className="text-center text-xl font-bold text-(--color-text-primary) mb-2"
                >
                    {title}
                </h3>

                {/* Description */}
                <p className="text-center text-sm text-text-secondary leading-relaxed px-2">
                    {description}
                </p>

                {/* Item info row */}
                {itemName && (
                    <div className="mt-5 flex items-center gap-3 px-4 py-3 rounded-xl border border-(--color-border)">
                        {ItemIcon && <ItemIcon className="text-xl text-text-secondary shrink-0" />}
                        <p className="text-sm text-text-secondary">
                            {itemLabel}: <span className="font-bold text-(--color-text-primary)">{itemName}</span>
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                    <AppButton
                        name={cancelText}
                        variant="secondary"
                        size="md"
                        onClick={onClose}
                        disabled={loading}
                        fullWidth
                    />
                    <AppButton
                        name={confirmText}
                        variant={theme.btnVariant}
                        size="md"
                        onClick={onConfirm}
                        loading={loading}
                        startIcon={confirmIcon}
                        fullWidth
                    />
                </div>
            </div>
        </div>
    );
}

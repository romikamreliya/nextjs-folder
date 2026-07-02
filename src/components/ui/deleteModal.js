"use client";

import { useEffect } from "react";
import { Trash, User } from "@/components/icon/icons";
import AppButton from "@/components/ui/button";

export default function AppDeleteModal({
    isOpen = false,
    onClose,
    onConfirm,
    title = "Delete",
    description = "This action cannot be undone.",
    itemName,
    loading = false,
    cancelText = "Cancel",
    confirmText = "Delete",
    itemIcon: ItemIcon = User,
    itemLabel = "User",
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

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={!loading ? onClose : undefined}
                aria-hidden="true"
            />

            {/* Modal Card */}
            <div className="relative z-10 w-full max-w-sm rounded-3xl bg-(--color-surface) shadow-xl p-6 animate-fade-in-up">

                {/* Icon */}
                <div className="flex justify-center mb-5">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 border border-rose-100">
                        <Trash className="text-3xl text-rose-500" />
                    </div>
                </div>

                {/* Title */}
                <h3
                    id="delete-modal-title"
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
                        variant="danger"
                        size="md"
                        onClick={onConfirm}
                        loading={loading}
                        startIcon={<Trash className="text-base" />}
                        fullWidth
                    />
                </div>
            </div>
        </div>
    );
}

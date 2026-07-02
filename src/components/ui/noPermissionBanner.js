"use client";

import { ShieldUser } from "@/components/icon/icons";

/**
 * Displayed when the current user lacks view permission for a resource.
 * @param {{ show: boolean, title: string, description: string, hint: string }} props
 */
export default function NoPermissionBanner({ show, title, description, hint }) {
    if (!show) return null;

    return (
        <div className="mb-7 overflow-hidden rounded-2xl border border-border-subtle bg-(--color-surface)">
            <div className="flex items-start gap-4 p-5 sm:p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--color-bg-subtle)">
                    <ShieldUser className="h-6 w-6 text-text-secondary" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-(--color-text-primary)">{title}</p>
                    <p className="mt-1 text-sm text-text-secondary leading-relaxed">{description}</p>
                </div>
            </div>
            <div className="border-t border-border-subtle bg-(--color-bg-subtle) px-5 py-3 sm:px-6">
                <p className="text-xs text-text-secondary">{hint}</p>
            </div>
        </div>
    );
}

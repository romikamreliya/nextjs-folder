import AppSwitch from "@/components/ui/switch";
import { VerifiedCheck, ForbiddenCircle } from "@/components/icon/icons";

export default function AppToggleCard({ checked = false, onChange, title, description, disabled = false }) {
  return (
    <AppSwitch
      isSelected={checked}
      onChange={(selected) => onChange?.(selected)}
      disabled={disabled}
      className={`flex min-h-18 items-center gap-3 rounded-2xl border px-3.5 py-3 transition ${
        checked
          ? "border-(--color-btn-primary)/25 bg-(--color-active)"
          : "border-border-subtle bg-(--color-surface) hover:bg-(--color-bg-subtle)"
      } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <div className="min-w-0">
        <span className="flex flex-wrap items-center gap-2">
          <span className="block text-sm font-bold text-(--color-text-primary)">{title}</span>
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
            checked
              ? "border-emerald-300/60 bg-emerald-100/70 text-emerald-800 dark:border-emerald-700/60 dark:bg-emerald-950/30 dark:text-emerald-300"
              : "border-border-subtle bg-surface-subtle text-text-secondary"
          }`}>
            {checked ? <VerifiedCheck className="size-3" /> : <ForbiddenCircle className="size-3" />}
            {checked ? "Enabled" : "Disabled"}
          </span>
        </span>
        {description && (
          <span className="mt-1 block text-xs leading-4 text-text-secondary">
            {description}
          </span>
        )}
      </div>
    </AppSwitch>
  );
}

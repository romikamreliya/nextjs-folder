export default function AppFormSection({
  step,
  title,
  description,
  children,
  className = "",
  contentClassName = "",
}) {
  return (
    <section className={`rounded-2xl border border-border-subtle bg-(--color-surface) p-5 mb-3 ${className}`}>
      <div className="mb-5 flex items-center gap-3">
        {step && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--color-bg) text-sm font-semibold text-text-secondary">
            {step}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-(--color-text-primary)">{title}</h3>
          {description && <p className="text-xs text-text-secondary">{description}</p>}
        </div>
      </div>

      <div className={contentClassName}>{children}</div>
    </section>
  );
}

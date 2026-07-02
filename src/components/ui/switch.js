import { Switch } from "@heroui/react";

export default function AppSwitch({
    isSelected,
    onChange,
    disabled = false,
    className = "",
    "aria-label": ariaLabel,
    children,
}) {
    const handleChange = (valueOrEvent) => {
        const nextValue = typeof valueOrEvent === "boolean"
            ? valueOrEvent
            : Boolean(valueOrEvent?.target?.checked);
        onChange?.(nextValue);
    };

    return (
        <Switch
            isSelected={isSelected}
            onChange={handleChange}
            isDisabled={disabled}
            className={`group flex items-center gap-3 ${className}`.trim()}
            aria-label={ariaLabel}
        >
            <Switch.Control className={`shrink-0 border-2 transition-all duration-200 rounded-full ${
                isSelected 
                    ? "border-(--color-btn-primary) bg-(--color-btn-primary)" 
                    : "border-(--color-border) dark:border-(--color-border-dark) bg-surface-subtle dark:bg-surface-muted"
            }`}>
                <Switch.Thumb className={`transition-all duration-200 rounded-full ${
                    isSelected 
                        ? "bg-(--color-card-bg) shadow-(--shadow-xs)" 
                        : "bg-(--color-card-bg) dark:bg-(--color-card-bg) shadow-sm"
                }`} />
            </Switch.Control>
            {children}
        </Switch>
    );
}

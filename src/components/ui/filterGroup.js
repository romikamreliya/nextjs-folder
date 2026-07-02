import { Filter } from "@/components/icon/icons";

export default function FilterGroup({
    options = [],
    selectedValue,
    onChange,
    label,
    description,
    className = ""
}) {
    return (
        <div className={`mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-(--color-surface) border border-(--color-border) shadow-xs transition-all duration-300 ${className}`}>
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 shadow-xs">
                    <Filter className="text-lg" />
                </div>
                <div>
                    {label && (
                        <h4 className="text-xs font-bold uppercase tracking-wider text-(--color-text-primary)">
                            {label}
                        </h4>
                    )}
                    {description && (
                        <p className="text-[11px] text-(--color-text-muted) font-medium">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            <div className="relative flex p-1.5 gap-1.5 rounded-lg bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800/80 max-w-full overflow-x-auto no-scrollbar">
                {options.map((opt) => {
                    const IconComponent = opt.icon;
                    const isActive = selectedValue === opt.id;
                    return (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => onChange && onChange(opt.id)}
                            className={`group flex items-center gap-2.5 px-4 py-2 rounded-md text-xs font-semibold cursor-pointer whitespace-nowrap transition-all duration-300 relative ${
                                isActive
                                    ? "bg-(--color-btn-primary) text-(--color-btn-primary-text) shadow-sm scale-[1.02]"
                                    : "text-(--color-text-secondary) hover:text-(--color-btn-primary-text) hover:bg-(--color-btn-primary) shadow-none hover:shadow-xs"
                            }`}
                        >
                            {IconComponent && (
                                <IconComponent 
                                    className={`text-base transition-all duration-300 ${
                                        isActive 
                                            ? "scale-110 rotate-3 text-(--color-btn-primary-text)" 
                                            : "text-(--color-text-muted) group-hover:scale-115 group-hover:text-(--color-btn-primary-text)"
                                    }`} 
                                />
                            )}
                            <span>{opt.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

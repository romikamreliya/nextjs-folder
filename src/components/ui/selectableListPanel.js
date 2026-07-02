"use client";

import React from "react";
import AppSearch from "@/components/ui/search";
import { Checkbox } from "@heroui/react";

function SelectableRow({ item, selected, onToggle }) {
  const Icon = item.icon;
  const darkCountBadge = item.darkCountBadge;

  const handleChange = (value) => {
    const nextSelected =
      typeof value === "boolean"
        ? value
        : Boolean(value?.target?.checked ?? value?.currentTarget?.checked);

    onToggle?.(item.id, nextSelected);
  };

  return (
    <Checkbox
      isSelected={selected}
      onChange={handleChange}
      className={`w-full rounded-lg border px-2.5 py-2 text-left transition ${selected ? "border-(--color-input-border) bg-(--color-bg-subtle)" : "border-transparent hover:border-border-subtle hover:bg-(--color-bg-subtle)"}`}
    >
      <Checkbox.Content className="min-w-0 flex-1">
        <span className="flex min-w-0 gap-2.5">
          {Icon && (
            <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${selected ? "bg-(--color-active) text-(--color-btn-primary)" : "bg-surface-subtle text-text-secondary"}`}>
              <Icon className="text-base" />
            </span>
          )}

          <span className="min-w-0 flex-1">
            <span className="flex min-w-0 items-center justify-between gap-2">
              <span className="truncate text-xs font-bold text-(--color-text-primary)">{item.label}</span>
              {item.count !== undefined && (
                <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${darkCountBadge ? "bg-(--color-btn-primary) text-(--color-btn-primary-text)" : "border-border-subtle bg-(--color-surface) text-text-secondary"}`}>
                  {item.count}
                </span>
              )}
            </span>
            {item.description && (
              <span className="mt-0.5 block line-clamp-2 text-[11px] leading-4 text-text-secondary">
                {item.description}
              </span>
            )}
          </span>

              <Checkbox.Control className={`relative size-4 rounded-sm! border-2 before:hidden! transition-colors duration-150 ease-out ${selected ? "border-(--color-btn-primary) bg-(--color-btn-primary)" : "border-(--color-checkbox-border-dark) bg-(--color-input-bg)"}`}>
            <Checkbox.Indicator className="relative z-10 text-white!" />
          </Checkbox.Control>
        </span>
      </Checkbox.Content>
    </Checkbox>
  );
}

function SelectableRowNoCheckbox({ item, selected, onToggle }) {
  const Icon = item.icon;
  const darkCountBadge = item.darkCountBadge;

  return (
    <button
      type="button"
      onClick={() => onToggle?.(item.id, !selected)}
      className={`w-full rounded-lg border px-2.5 py-2 text-left transition ${selected ? "border-(--color-input-border) bg-(--color-bg-subtle)" : "border-transparent hover:border-border-subtle hover:bg-(--color-bg-subtle)"}`}
    >
      <span className="flex min-w-0 gap-2.5">
        {Icon && (
          <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${selected ? "bg-(--color-active) text-(--color-btn-primary)" : "bg-surface-subtle text-text-secondary"}`}>
            <Icon className="text-base" />
          </span>
        )}

        <span className="min-w-0 flex-1">
          <span className="flex min-w-0 items-center justify-between gap-2">
            <span className="truncate text-xs font-bold text-(--color-text-primary)">{item.label}</span>
            {item.count !== undefined && (
              <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${darkCountBadge ? "bg-(--color-btn-primary) text-(--color-btn-primary-text)" : "border-border-subtle bg-(--color-surface) text-text-secondary"}`}>
                {item.count}
              </span>
            )}
          </span>
          {item.description && (
            <span className="mt-0.5 block line-clamp-2 text-[11px] leading-4 text-text-secondary">
              {item.description}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}

export default function AppSelectableListPanel({
  title,
  items,
  selectedValues,
  onToggle,
  searchPlaceholder,
  selectAll,
  showCheckbox = true,
  showSearch = true,
  darkCountBadge = false,
  emptyText = "No results found.",
}) {
  const [query, setQuery] = React.useState("");
  const selectedSet = React.useMemo(() => new Set(selectedValues), [selectedValues]);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = React.useMemo(() => {
    if (!normalizedQuery) return items;

    return items.filter((item) =>
      [item.label, item.description].filter(Boolean).some((value) => value.toLowerCase().includes(normalizedQuery)),
    );
  }, [items, normalizedQuery]);

  return (
    <div className="flex min-h-80 flex-col overflow-hidden rounded-xl border border-border-subtle bg-(--color-surface)">
      <div className="border-b border-border-subtle px-3 py-2.5">
        <h4 className="text-sm font-bold text-(--color-text-primary)">{title}</h4>
      </div>

      {showSearch && (
        <div className="border-b border-border-subtle px-3 py-2.5">
          <AppSearch
            value={query}
            onChange={setQuery}
            placeholder={searchPlaceholder}
            debounceMs={0}
            className="h-9"
            inputClassName="text-xs"
          />
        </div>
      )}

      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {selectAll && showCheckbox && !normalizedQuery && (
          <SelectableRow item={selectAll.item} selected={selectAll.checked} onToggle={(_, value) => selectAll.onToggle?.(value)} />
        )}

        {filteredItems.map((item) => (
          showCheckbox
            ? <SelectableRow key={item.id} item={{...item, darkCountBadge}} selected={selectedSet.has(item.id)} onToggle={onToggle} />
            : <SelectableRowNoCheckbox key={item.id} item={{...item, darkCountBadge}} selected={selectedSet.has(item.id)} onToggle={onToggle} />
        ))}

        {filteredItems.length === 0 && (
          <div className="flex min-h-32 items-center justify-center px-3 text-center text-xs text-(--color-text-muted)">
            {emptyText}
          </div>
        )}
      </div>
    </div>
  );
}

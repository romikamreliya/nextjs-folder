import { ComboBox, ComboBoxInputGroup, ComboBoxTrigger, ComboBoxPopover, InputGroup, Label, ListBox, FieldError } from "@heroui/react";
import React from "react";
import AppLoading from "./loading";

export default function AppComboBox({
    name,
    label,
    placeholder,
    items = [],
    selectedKey,
    onChange,
    isDisabled = false,
    startIcon,
    required = false,
    inputValue,
    onInputChange,
    errors,
    className = "",
    isLoading = false,
    emptyMessage,
}) {
    const errorMessage = errors?.[name]?.message;

    return (
        <ComboBox
            placeholder={placeholder}
            className={`w-full relative mb-1.5 ${className}`}
            isDisabled={isDisabled}
            selectedKey={selectedKey === "" || selectedKey === null || selectedKey === undefined ? null : String(selectedKey)}
            onSelectionChange={(key) => onChange && onChange(key)}
            inputValue={inputValue}
            onInputChange={onInputChange}
            isInvalid={!!errorMessage}
            allowsEmptyCollection={true}
        >
            {label && (
                <Label className="mb-1 text-sm font-medium text-(--color-text) block">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </Label>
            )}
            
            <ComboBoxInputGroup className={`w-full h-12 flex items-center px-3 gap-2
                    rounded-lg border bg-(--color-select-bg) shadow-(--shadow-sm)
                    transition-all
                    border-(--color-select-border)
                    hover:border-(--color-border-dark)
                    focus-within:border-(--color-input-focus)
                    focus-within:ring-1
                    focus-within:ring-(--color-input-focus)
                    ${errorMessage ? "border-(--color-danger)" : ""}`}>
                {startIcon && (
                    <span className="text-(--color-input-placeholder) flex items-center shrink-0">
                        {startIcon}
                    </span>
                )}
                <InputGroup.Input
                    placeholder={placeholder}
                    className="w-full h-full flex-1 bg-transparent px-3 text-sm text-(--color-input-text) placeholder:text-(--color-input-placeholder) focus:outline-none"
                />
                {selectedKey && !isDisabled && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange && onChange(null);
                            onInputChange && onInputChange("");
                        }}
                        className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer mr-1 shrink-0"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </ComboBoxInputGroup>

            <ComboBoxPopover className="min-w-[var(--trigger-width)]">
                {isLoading ? (
                    <div className="flex justify-center items-center w-full py-4">
                        <AppLoading />
                    </div>
                ) : (
                    <ListBox>
                        {items.length === 0 ? (
                            <ListBox.Item id="__empty__" textValue={inputValue || "No options"} isDisabled>
                                {emptyMessage || "No options available"}
                            </ListBox.Item>
                        ) : (
                            items.map((item) => (
                                <ListBox.Item id={String(item.id)} textValue={`${item.label}`} key={String(item.id)}>
                                    {item.label}
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>
                            ))
                        )}
                    </ListBox>
                )}
            </ComboBoxPopover>

            {errorMessage && (
                <FieldError className="text-xs text-red-500 block mt-1">
                    {errorMessage}
                </FieldError>
            )}
        </ComboBox>
    );
}

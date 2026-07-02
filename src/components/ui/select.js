import {Header, Label, ListBox, Select, Separator, FieldError} from "@heroui/react";
import React from "react";

export default function AppSections({name, label, placeholder, items, register, type = "single", className = "", onChange, isDisabled = false, selectedKey, startIcon, required = false, errors}) {
    const errorMessage = errors?.[name]?.message;

    return (
        <Select 
            placeholder={placeholder} 
            className={`
                w-full relative ${className.includes("mb-") ? "" : "mb-1.5"}
                ${className}
            `}
            name={name}
            isDisabled={isDisabled}
            isInvalid={!!errorMessage}
            {...(selectedKey !== undefined && { value: selectedKey === "" ? null : (selectedKey ?? null) })}
            {...(register && register(name))}
            {...(onChange && { onChange })}
          >
            {label && (
                <Label className="mb-1 text-sm font-medium text-(--color-text) block">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </Label>
            )}
            <Select.Trigger className={`w-full h-12 flex items-center px-3 gap-2
                    rounded-lg border bg-(--color-select-bg) shadow-(--shadow-sm)
                    transition-all duration-200
                    border-(--color-select-border)
                    hover:border-(--color-border-dark)
                    focus-within:border-(--color-input-focus)
                    focus-within:ring-4
                    focus-within:ring-zinc-950/5
                    dark:focus-within:ring-zinc-100/5
                    ${errorMessage ? "border-(--color-danger) focus-within:ring-red-500/10" : ""}`}>
                {startIcon && (
                    <span className="text-(--color-input-placeholder) flex items-center shrink-0">
                        {startIcon}
                    </span>
                )}
                <div className="flex-1 flex items-center min-w-0 w-11.25 pr-1.75  whitespace-nowrap overflow-hidden text-ellipsis">
                    <Select.Value className="text-sm pr-1.25 text-(--color-input-text) truncate " />
                </div>
                <Select.Indicator className="ml-auto" />
            </Select.Trigger>

            <Select.Popover>
                <ListBox>
                    {
                        items.length === 0 ? (
                            <ListBox.Item id="__empty__" textValue="No options" isDisabled>
                                No options available
                            </ListBox.Item>
                        ) : type === "single" ? (
                                items.map((item) => (
                                    <ListBox.Item id={item.id} textValue={`${item.label}`} key={item.id}>
                                        {item.label}
                                        <ListBox.ItemIndicator />
                                    </ListBox.Item>
                                )
                            )    
                        ) : type === "multiple" ? (
                            items?.map((item) => (
                                <React.Fragment key={item.id}>
                                    <ListBox.Section>
                                        <Header>{item.name}</Header>
                                        {
                                            item.items?.map((child) => (
                                                <ListBox.Item id={child.id} textValue={`${item.label}`} key={child.id}>
                                                    {child.label}
                                                    <ListBox.ItemIndicator />
                                                </ListBox.Item>
                                            ))
                                        }
                                    </ListBox.Section>
                                    <Separator />
                                </React.Fragment>
                            ))
                        ) : null
                    }
                </ListBox>
            </Select.Popover>

            {errorMessage && (
                <FieldError className="text-xs text-red-500 block mt-1">
                    {errorMessage}
                </FieldError>
            )}
        </Select>
    );
}
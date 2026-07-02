import {Description, FieldError, InputGroup, Label, TextField } from "@heroui/react";

export default function AppInput({
    name,
    label,
    placeholder,
    type = "text",

    register,
    validation = {},

    errors,

    startIcon,
    endIcon,
    endIconAction,

    description,
    required = false,
    className = "",
    value,
    defaultValue,
    disabled = false,
    onChange,
}) {

    if (!name) {
        throw new Error("Input name is required");
    }

    const errorMessage = errors?.[name]?.message;
    const registration = register ? register(name, validation) : {};

    const handleValueChange = (val) => {
        if (registration.onChange) {
            registration.onChange({
                target: {
                    name,
                    value: val,
                },
            });
        }
        if (onChange) {
            onChange(val);
        }
    };

    return (
        <TextField
            className={`w-full relative ${className}`}
            name={name}
            isInvalid={!!errorMessage}
            isDisabled={disabled}
            {...(value !== undefined && { value })}
            {...(defaultValue !== undefined && { defaultValue })}
            onChange={value !== undefined ? handleValueChange : onChange}
        >
            {
                label && (
                    <Label className="mb-1 text-sm font-medium text-(--color-text)">
                        {label} {required && <span className="text-red-500">*</span>}
                    </Label>
                )
            }

            <InputGroup
                className={`
                    w-full h-12 rounded-lg border bg-(--color-input-bg) shadow-(--shadow-sm)
                    transition-all
                    border-(--color-input-border)
                    hover:border-(--color-border-dark)
                    focus-within:border-(--color-input-focus)
                    focus-within:ring-1
                    focus-within:ring-(--color-input-focus)
                    ${errorMessage ? "border-(--color-danger)" : ""}
                `}
            >
                {
                    startIcon && (
                        <InputGroup.Prefix className="pl-3 pr-0 text-(--color-input-placeholder)">
                            {startIcon}
                        </InputGroup.Prefix>
                    )
                }

                <InputGroup.Input
                    type={type}
                    placeholder={placeholder || `Enter ${label}`}
                    className="
                        w-full h-full flex-1 bg-transparent px-3
                        text-sm text-(--color-input-text)
                        placeholder:text-(--color-input-placeholder)
                        focus:outline-none
                    "
                    {...(register ? register(name, validation) : {})}
                    autoComplete="new-password"
                />

                {
                    endIcon && (
                        <InputGroup.Suffix
                            onClick={endIconAction}
                            className="pr-3 pl-0 text-(--color-input-placeholder) cursor-pointer"
                        >
                            {endIcon}
                        </InputGroup.Suffix>
                    )
                }
            </InputGroup>

            <div className="min-h-[10px]">
                {errorMessage ? (
                    <FieldError className="text-xs text-red-500 block">
                        {errorMessage}
                    </FieldError>
                ) : description ? (
                    <Description className="text-xs text-(--color-text-muted) block">
                        {description}
                    </Description>
                ) : null}
            </div>
        </TextField>
    );
}
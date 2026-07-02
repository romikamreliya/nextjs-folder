import { Checkbox, Description, Label } from "@heroui/react";

export default function AppCheckbox({
    name,

    label,
    description,

    register,
    validation = {},

    errors,

    disabled = false,

    className = "",
    controlClassName = "",
    classNames = {},

    isSelected,
    onChange,
    isIndeterminate = false,
}) {
    if (!name) {
        throw new Error("Checkbox name is required");
    }

    const errorMessage = errors?.[name]?.message;
    
    return (
        <Checkbox
            isInvalid={!!errorMessage}
            id={name}
            className={`${className} ${disabled ? "opacity-60 cursor-not-allowed pointer-events-none" : ""}`}
            classNames={classNames}
            isDisabled={disabled}
            isIndeterminate={isIndeterminate}
            {...(isSelected !== undefined && { isSelected })}
            {...(onChange && { onChange })}
        >
            {({ isSelected: checked, isIndeterminate }) => (
                <>
                    <Checkbox.Control className={`relative size-4 rounded-sm! border-2 before:hidden! transition-colors duration-150 ease-out ${checked || isIndeterminate ? "border-(--color-btn-primary) bg-(--color-btn-primary)" : "border-(--color-checkbox-border-dark) bg-(--color-input-bg)"} before:rounded-xs`}>
                        <Checkbox.Indicator className="relative z-10 text-white!" />
                    </Checkbox.Control>
                    <Checkbox.Content>
                        {label && (
                            <Label htmlFor={name} className={classNames?.label}>
                                {label}
                            </Label>
                        )}
                        {description && !errorMessage && (
                            <Description>
                                {description}
                            </Description>
                        )}
                        {errorMessage && (
                            <div className="text-xs text-red-500">{errorMessage}</div>
                        )}
                    </Checkbox.Content>
                </>
            )}
        </Checkbox>
    );
}

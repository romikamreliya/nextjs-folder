import { Button } from "@heroui/react";

export default function AppButton({

    name,
    type = "button",

    onClick,

    disabled = false,
    loading = false,

    startIcon,
    endIcon,

    fullWidth = true,

    size = "lg",

    variant = "primary",

    className = "",
}) {

    if (!name) {
        throw new Error("Button name is required");
    }

    const variantClasses = {
        primary: `
            bg-(--color-btn-primary)
            text-(--color-btn-primary-text)
            border border-(--color-btn-primary)
            shadow-(--shadow-sm)

            hover:bg-(--color-btn-primary-hover)
            hover:border-(--color-btn-primary-hover)
            hover:shadow-(--shadow-md)
            active:bg-(--color-btn-primary-active)
        `,

        secondary: `
            bg-(--color-btn-secondary)
            text-(--color-btn-secondary-text)
            border border-(--color-btn-secondary-border)
            shadow-(--shadow-xs)

            hover:bg-(--color-btn-secondary-hover)
            hover:border-(--color-border-dark)
        `,

        danger: `
            bg-red-600
            text-(--color-btn-primary-text)

            hover:bg-red-700
        `,
    };

    return (
        <Button
            type={type}
            size={size}
            disabled={disabled || loading}
            isPending={loading}
            onClick={onClick}
            className={`
                px-6
                rounded-lg
                font-semibold
                flex items-center justify-center gap-2
                transition-all duration-200
                active:scale-[0.98]
                ${fullWidth ? "w-full" : ""}
                ${variantClasses[variant]}
                ${disabled || loading ? "cursor-not-allowed opacity-60 pointer-events-none active:scale-100" : ""}
                ${className}
            `}
        >
            {
                loading ? (
                    <span className="animate-pulse">
                        Loading...
                    </span>
                ) : (
                    <>
                        {startIcon && startIcon}

                        {name}

                        {endIcon && endIcon}
                    </>
                )
            }
        </Button>
    );
}
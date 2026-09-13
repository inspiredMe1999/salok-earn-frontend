import {
    forwardRef,
} from "react";

import {
    ArrowRight,
    LoaderCircle,
} from "lucide-react";

const Button = forwardRef(
    function Button(
        {
            children,
            variant = "primary",
            size = "medium",
            loading = false,
            icon,
            iconPosition = "right",
            fullWidth = false,
            className = "",
            disabled = false,
            type = "button",
            ...props
        },
        ref
    ) {
        const classes = [
            "se-button",
            `se-button-${variant}`,
            `se-button-${size}`,
            fullWidth
                ? "se-button-full"
                : "",
            className,
        ]
            .filter(Boolean)
            .join(" ");

        const buttonIcon =
            icon ??
            (iconPosition === "right"
                ? <ArrowRight size={18} />
                : null);

        return (
            <button
                ref={ref}
                type={type}
                className={classes}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <LoaderCircle
                        size={18}
                        className="se-button-spinner"
                    />
                ) : (
                    <>
                        {iconPosition === "left" &&
                            buttonIcon}

                        <span>
                            {children}
                        </span>

                        {iconPosition === "right" &&
                            buttonIcon}
                    </>
                )}
            </button>
        );
    }
);

export default Button;
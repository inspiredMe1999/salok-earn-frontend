import {
    Moon,
    Sun,
} from "lucide-react";

import useTheme from "../../hooks/useTheme";

export default function ThemeToggle({
    className = "",
}) {
    const {
        isDark,
        toggleTheme,
    } = useTheme();

    return (
        <button
            type="button"
            className={[
                "theme-toggle",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            onClick={toggleTheme}
            aria-label={
                isDark
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            }
            title={
                isDark
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            }
        >
            <span className="theme-toggle-icon">
                {isDark ? (
                    <Sun size={17} />
                ) : (
                    <Moon size={17} />
                )}
            </span>
        </button>
    );
}
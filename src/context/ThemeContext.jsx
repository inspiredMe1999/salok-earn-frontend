import {
    createContext,
    useEffect,
    useState,
} from "react";

export const ThemeContext = createContext(null);

const STORAGE_KEY = "salok-earn-theme";

function getInitialTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY);

    if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
    }

    return window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches
        ? "dark"
        : "light";
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        const root = document.documentElement;

        root.setAttribute("data-theme", theme);

        localStorage.setItem(
            STORAGE_KEY,
            theme
        );
    }, [theme]);

    const toggleTheme = () => {
        setTheme((currentTheme) =>
            currentTheme === "dark"
                ? "light"
                : "dark"
        );
    };

    const setThemeMode = (mode) => {
        if (mode !== "light" && mode !== "dark") {
            return;
        }

        setTheme(mode);
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme: setThemeMode,
                toggleTheme,
                isDark: theme === "dark",
                isLight: theme === "light",
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}
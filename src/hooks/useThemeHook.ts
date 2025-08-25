import { useState, useEffect, useCallback } from "react";

export function useTheme() {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        // Check if the stored theme is one of the valid options
        if (storedTheme === "dark") {
            document.documentElement.classList.add("dark");
            setTheme("dark");
        } else if (storedTheme === "light") {
            document.documentElement.classList.remove("dark");
            setTheme("light");
        } else if (prefersDark) {
            // Fallback to system preference if no valid theme is stored
            document.documentElement.classList.add("dark");
            setTheme("dark");
        } else {
            // Default to light mode
            document.documentElement.classList.remove("dark");
            setTheme("light");
        }
    }, []);

    const toggleTheme = useCallback(() => {
        if (theme === "dark") {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setTheme("light");
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setTheme("dark");
        }
    }, [theme]);

    return { theme, toggleTheme };
}
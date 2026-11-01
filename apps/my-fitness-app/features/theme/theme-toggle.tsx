"use client";

import { useEffect, useState } from "react";

import { Moon, Sun } from "lucide-react";

const storageKey = "fitness-os-theme";
type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#010d1a" : "#f4f7fb");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    setTheme(current);
    applyTheme(current);
    function sync(event: StorageEvent) {
      if (event.key !== storageKey && event.key !== null) return;
      const next = event.newValue === "light" ? "light" : "dark";
      applyTheme(next);
      setTheme(next);
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  return (
    <button
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      className="theme-toggle"
      onClick={() => {
        const next = theme === "light" ? "dark" : "light";
        applyTheme(next);
        setTheme(next);
        try {
          localStorage.setItem(storageKey, next);
        } catch {
          /* Still works when storage is unavailable. */
        }
      }}
      type="button"
    >
      <Moon aria-hidden="true" className="theme-moon" size={16} />
      <Sun aria-hidden="true" className="theme-sun" size={16} />
      <span>Theme</span>
    </button>
  );
}

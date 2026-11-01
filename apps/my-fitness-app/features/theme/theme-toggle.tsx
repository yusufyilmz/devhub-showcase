"use client";

import { useContext } from "react";

import { Moon, Sun } from "lucide-react";

import { ThemeContext } from "@shared/ui/theme";

export function ThemeToggle() {
  const { mode, toggle } = useContext(ThemeContext);
  return (
    <button
      aria-label={`Switch to ${mode === "light" ? "dark" : "light"} theme`}
      className="theme-toggle"
      onClick={toggle}
      type="button"
    >
      <Moon aria-hidden="true" className="theme-moon" size={16} />
      <Sun aria-hidden="true" className="theme-sun" size={16} />
      <span>Theme</span>
    </button>
  );
}

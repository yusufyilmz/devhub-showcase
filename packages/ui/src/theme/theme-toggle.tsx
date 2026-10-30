"use client";
import { createContext, useContext } from "react";
export const ThemeContext = createContext({ mode: "dark", toggle: () => {} });
export function ThemeToggle({
  labels = { light: "Switch to light theme", dark: "Switch to dark theme" },
}: {
  labels?: { light: string; dark: string };
}) {
  const { mode, toggle } = useContext(ThemeContext);
  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={mode === "dark" ? labels.light : labels.dark}
      title={mode === "dark" ? labels.light : labels.dark}
      onClick={toggle}
    >
      <span aria-hidden="true">{mode === "dark" ? "☀" : "☾"}</span>
    </button>
  );
}

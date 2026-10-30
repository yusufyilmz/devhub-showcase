"use client";
import { createContext, useContext } from "react";
export const ThemeContext = createContext({ mode: "dark", toggle: () => {} });
export function ThemeToggle({
  labels = { dark: "Switch to dark theme", light: "Switch to light theme" },
}: {
  labels?: { light: string; dark: string };
}) {
  const { mode, toggle } = useContext(ThemeContext);
  return (
    <button
      aria-label={mode === "dark" ? labels.light : labels.dark}
      className="theme-toggle"
      onClick={toggle}
      title={mode === "dark" ? labels.light : labels.dark}
      type="button"
    >
      <span aria-hidden="true">{mode === "dark" ? "☀" : "☾"}</span>
    </button>
  );
}

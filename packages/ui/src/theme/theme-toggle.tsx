"use client";

import "../navigation/chrome.css";

import { createContext, useContext } from "react";

import { Button as LibraryButton } from "../buttons/button/Button";
import { themeToggleStyles } from "./styles";
import type { ThemeToggleOptions } from "./types";

export const ThemeContext = createContext({ mode: "dark", toggle: () => {} });

export function ThemeToggle({
  labels = { dark: "Switch to dark theme", light: "Switch to light theme" },
}: ThemeToggleOptions) {
  const { mode, toggle } = useContext(ThemeContext);
  return (
    <LibraryButton
      aria-label={mode === "dark" ? labels.light : labels.dark}
      className={themeToggleStyles.element1}
      onClick={toggle}
      title={mode === "dark" ? labels.light : labels.dark}
      type="button"
      variant="unstyled"
    >
      <span aria-hidden="true">{mode === "dark" ? "☀" : "☾"}</span>
    </LibraryButton>
  );
}

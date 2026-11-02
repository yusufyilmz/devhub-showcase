"use client";

import "../navigation/chrome.css";
import "./settings.css";

import { createContext, useContext } from "react";

import { themePreferenceOptions, useUserConfigStore } from "@shared/runtime/user";

import { Button as LibraryButton } from "../buttons/button/Button";
import { Label as LibraryLabel } from "../forms/label/Label";
import { NativeSelect as LibraryNativeSelect } from "../forms/native-select";
import { Popover, PopoverContent, PopoverTrigger } from "../overlays/popover/Popover";
import { themeSettingsStyles, themeToggleStyles } from "./styles";
import type { ThemeToggleOptions } from "./types";

export const ThemeContext = createContext({ mode: "dark", toggle: () => {} });

export function ThemeToggle({
  labels = { dark: "Switch to dark theme", light: "Switch to light theme" },
}: ThemeToggleOptions) {
  const { mode, toggle } = useContext(ThemeContext);
  const preferences = useUserConfigStore((state) => state.themePreferences);
  const activeMode = useUserConfigStore((state) => state.activeMode);
  return (
    <>
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
      <Popover>
        <PopoverTrigger asChild>
          <LibraryButton
            aria-label="Theme settings"
            className="theme-toggle"
            type="button"
            variant="unstyled"
          >
            ⚙
          </LibraryButton>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          aria-label="Theme settings"
          className={themeSettingsStyles.panel}
        >
          <LibraryLabel className={themeSettingsStyles.field}>
            Mode
            <LibraryNativeSelect
              aria-label="Mode"
              onChange={(event) => {
                const value = event.target.value;
                if (value === "light" || value === "dark" || value === "system")
                  useUserConfigStore.getState().setActiveMode(value);
              }}
              value={activeMode ?? "system"}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </LibraryNativeSelect>
          </LibraryLabel>
          {Object.entries(themePreferenceOptions).map(([key, values]) => (
            <LibraryLabel className={themeSettingsStyles.field} key={key}>
              {key.replaceAll("-", " ")}
              <LibraryNativeSelect
                aria-label={key.replaceAll("-", " ")}
                onChange={(event) => {
                  if (event.target.value)
                    useUserConfigStore
                      .getState()
                      .setThemePreferences({ [key]: event.target.value });
                  else
                    useUserConfigStore.setState((state) => ({
                      themePreferences: Object.fromEntries(
                        Object.entries(state.themePreferences).filter(([name]) => name !== key),
                      ),
                    }));
                }}
                value={preferences[key as keyof typeof preferences] ?? ""}
              >
                <option value="">Page default</option>
                {values.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </LibraryNativeSelect>
            </LibraryLabel>
          ))}
          <LibraryButton
            onClick={() => useUserConfigStore.setState({ themePreferences: {} })}
            type="button"
            variant="outline"
          >
            Reset appearance
          </LibraryButton>
        </PopoverContent>
      </Popover>
    </>
  );
}

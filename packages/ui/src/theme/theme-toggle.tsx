"use client";

import "../navigation/chrome.css";
import "./settings.css";

import { createContext, useContext, useState } from "react";

import { Moon, Palette, Sun, SwatchBook } from "lucide-react";

import { themePreferenceOptions, useUserConfigStore } from "@shared/runtime/user";

import { Button as LibraryButton } from "../buttons/button/Button";
import { Label as LibraryLabel } from "../forms/label/Label";
import { NativeSelect as LibraryNativeSelect } from "../forms/native-select";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../overlays/dialog/Dialog";
import { appearanceGroups, themeSettingsStyles, themeToggleStyles } from "./styles";
import type { ThemeToggleOptions } from "./types";

export const ThemeContext = createContext({ mode: "dark", toggle: () => {} });

export function ThemeToggle({
  labels = { dark: "Switch to dark theme", light: "Switch to light theme" },
}: ThemeToggleOptions) {
  const { mode, toggle } = useContext(ThemeContext);
  const preferences = useUserConfigStore((state) => state.themePreferences);
  const activeMode = useUserConfigStore((state) => state.activeMode);
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <div className="appearance-launcher" data-expanded={expanded || undefined}>
        <LibraryButton
          aria-expanded={expanded}
          aria-label="Appearance controls"
          className="theme-toggle"
          onClick={() => setExpanded(!expanded)}
          type="button"
          variant="unstyled"
        >
          <Palette size={18} />
        </LibraryButton>
        <div className="appearance-quick-actions">
          <LibraryButton
            aria-label={mode === "dark" ? labels.light : labels.dark}
            className={themeToggleStyles.element1}
            onClick={toggle}
            title={mode === "dark" ? labels.light : labels.dark}
            type="button"
            variant="unstyled"
          >
            {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </LibraryButton>
          <LibraryButton
            aria-label="Theme settings"
            className="theme-toggle"
            onClick={() => setOpen(true)}
            type="button"
            variant="unstyled"
          >
            <SwatchBook size={18} />
          </LibraryButton>
        </div>
      </div>
      <DialogContent className="appearance-dialog">
        <header>
          <DialogTitle>Make yourself at home</DialogTitle>
          <DialogDescription>
            Choose your colors, typography and space. Saved on this device.
          </DialogDescription>
        </header>
        <div className="appearance-visual-options">
          {appearanceGroups.map(({ key, label, values }) => (
            <fieldset className="appearance-group" key={key}>
              <legend>{label}</legend>
              <div className="appearance-options" data-options={key}>
                {values.map((value) => (
                  <LibraryButton
                    aria-label={`${label}: ${value}`}
                    aria-pressed={preferences[key] === value}
                    className="appearance-choice"
                    key={value}
                    onClick={() =>
                      useUserConfigStore.getState().setThemePreferences({ [key]: value })
                    }
                    type="button"
                    variant="unstyled"
                  >
                    <span
                      aria-hidden="true"
                      className="appearance-sample"
                      data-kind={key}
                      data-value={value}
                    >
                      {key === "font" ? "Aa" : key === "accent" ? "" : "▰ ▰ ▰"}
                    </span>
                    <span>
                      {(
                        {
                          mono: "Monospace",
                          sans: "Geist Sans",
                          serif: "Editorial Serif",
                        } as Record<string, string>
                      )[value] ?? value}
                    </span>
                  </LibraryButton>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
        <details className="appearance-advanced">
          <summary>More preferences</summary>
          <div>
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
          </div>
        </details>
        <LibraryButton
          onClick={() => useUserConfigStore.setState({ themePreferences: {} })}
          type="button"
          variant="outline"
        >
          Reset appearance
        </LibraryButton>
      </DialogContent>
    </Dialog>
  );
}

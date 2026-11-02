"use client";

import "../navigation/chrome.css";
import "./settings.css";

import { createContext, useContext, useState } from "react";

import { Moon, Palette, Sun, SwatchBook } from "lucide-react";

import { useUserConfigStore } from "@shared/runtime/user";

import { Button as LibraryButton } from "../buttons/button/Button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../overlays/dialog/Dialog";
import { AppearanceOptions } from "./AppearanceOptions";
import { themeToggleStyles } from "./styles";
import type { ThemeToggleOptions } from "./types";

export const ThemeContext = createContext({ mode: "dark", toggle: () => {} });

export function ThemeToggle({
  labels = { dark: "Switch to dark theme", light: "Switch to light theme" },
}: ThemeToggleOptions) {
  const { mode, toggle } = useContext(ThemeContext);
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
        <AppearanceOptions />
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

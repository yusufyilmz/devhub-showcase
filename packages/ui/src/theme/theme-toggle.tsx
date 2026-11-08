"use client";

import "../navigation/chrome.css";
import "./settings.css";

import { createContext, useContext, useId, useState } from "react";

import { Moon, Palette, Sun, SwatchBook } from "lucide-react";

import { useThemeStore } from "@shared/runtime/user";

import { IconButton } from "../buttons";
import { Button as LibraryButton } from "../buttons/button/Button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../overlays/dialog/Dialog";
import { AppearanceOptions } from "./AppearanceOptions";
import type { ThemeToggleOptions } from "./types";

export const ThemeContext = createContext({ mode: "dark", toggle: () => {} });

type QuickActionSide = "left" | "right" | "inline-left" | "inline-right";

function quickActionSide(launcher: HTMLElement): QuickActionSide {
  const { left, right } = launcher.getBoundingClientRect();
  const before = launcher.previousElementSibling?.getBoundingClientRect();
  const after = launcher.nextElementSibling?.getBoundingClientRect();
  const leftGap = left - (before?.width ? before.right : 0);
  const rightGap = (after?.width ? after.left : document.documentElement.clientWidth) - right;
  if (leftGap >= 64) return "left";
  if (rightGap >= 64) return "right";
  return left > document.documentElement.clientWidth - right ? "inline-left" : "inline-right";
}

export function ThemeToggle({
  labels = { dark: "Switch to dark theme", light: "Switch to light theme" },
}: ThemeToggleOptions) {
  const { mode, toggle } = useContext(ThemeContext);
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<QuickActionSide>("left");
  const actionsId = useId();
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <div
        className="appearance-launcher"
        data-expanded={expanded || undefined}
        data-side={side}
        onFocus={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setSide(quickActionSide(event.currentTarget));
          }
        }}
        onPointerEnter={(event) => setSide(quickActionSide(event.currentTarget))}
      >
        <IconButton
          aria-controls={actionsId}
          aria-expanded={expanded}
          aria-label="Appearance controls"
          className="theme-toggle pr-0.5"
          onClick={() => setExpanded((value) => !value)}
          type="button"
        >
          <Palette size={18} />
        </IconButton>
        <div className="appearance-quick-actions" id={actionsId}>
          <IconButton
            aria-label={mode === "dark" ? labels.light : labels.dark}
            className={"theme-toggle"}
            onClick={toggle}
            title={mode === "dark" ? labels.light : labels.dark}
            type="button"
          >
            {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </IconButton>
          <IconButton
            aria-label="Theme settings"
            className="theme-toggle"
            onClick={() => setOpen(true)}
            type="button"
          >
            <SwatchBook size={18} />
          </IconButton>
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
          onClick={() => useThemeStore.setState({ themePreferences: {} })}
          type="button"
          variant="outline"
        >
          Reset appearance
        </LibraryButton>
      </DialogContent>
    </Dialog>
  );
}

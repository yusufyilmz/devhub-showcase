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

export function ThemeToggle({
  labels = { dark: "Switch to dark theme", light: "Switch to light theme" },
}: ThemeToggleOptions) {
  const { mode, toggle } = useContext(ThemeContext);
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const actionsId = useId();
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <div
        className="appearance-launcher [position:relative] [display:flex] [align-items:center] [&_.theme-toggle]:[width:40px] [min-width:40px] [height:40px] [min-height:40px] [padding:0] [&_.theme-toggle_svg]:[width:18px] [height:18px] [&_.appearance-quick-actions_.theme-toggle]:[margin:0] [color:var(--foreground)] [background:transparent] [border:0] [border-radius:8px] [&_.appearance-quick-actions_.theme-toggle:hover]:[background:color-mix(in_srgb,_var(--primary)_12%,_var(--popover))] [&_.theme-toggle:focus-visible]:[outline [display:inline-flex] [gap:9px] [justify-content:center] [min-height:42px] [padding:12px_17px] [font-size:12px] [font-weight:600] [background:var(--surface)] [border:1px_solid_var(--line)] max-[700px]:[min-height:38px] [padding:9px_12px] [font-size:10px] hover:[color:var(--accent)] [border-color:var(--accent)]:2px_solid_var(--ring)] [outline-offset:-2px] hover:[&_.appearance-quick-actions]:[visibility:visible] [pointer-events:auto] [opacity:1] focus-within:[&_.appearance-quick-actions]:[visibility:visible] [&[data-expanded]_.appearance-quick-actions]:[visibility:visible]"
        data-expanded={expanded || undefined}
      >
        <IconButton
          aria-controls={actionsId}
          aria-expanded={expanded}
          aria-label="Appearance controls"
          className="theme-toggle [display:grid] [flex:0_0_auto] [place-items:center] [width:40px] [height:40px] [font-size:22px] [color:var(--foreground)] [background:var(--card)] [border:1px_solid_var(--border)] [border-radius:50%] [transition:border-color_160ms] hover:[border-color:var(--primary)] [display:inline-flex] [gap:7px] [align-items:center] [justify-content:center] [min-height:36px] [padding:8px_10px] [font-size:11px] [color:var(--accent)] [background:var(--surface)] [border:1px_solid_var(--line)] [border-radius:8px] hover:[background:var(--accent-soft)] [border-color:var(--accent)] max-[700px]:[&_span]:[display:none] max-[700px]:[min-width:36px] pr-0.5"
          onClick={() => setExpanded((value) => !value)}
          type="button"
        >
          <Palette size={18} />
        </IconButton>
        <div
          className="appearance-quick-actions [position:absolute] [inset-block-start:100%] [inset-inline-end:0] [z-index:110] [display:flex] [visibility:hidden] [gap:4px] [align-items:center] [padding:4px] [pointer-events:none] [background:var(--popover)] [border:1px_solid_var(--border)] [border-radius:12px] [box-shadow:0_8px_24px_color-mix(in_srgb,_var(--foreground)_14%,_transparent)] [opacity:0] [transition:opacity_160ms_ease] motion-reduce:[transition:none]"
          id={actionsId}
        >
          <IconButton
            aria-label={mode === "dark" ? labels.light : labels.dark}
            className={
              "theme-toggle [display:grid] [flex:0_0_auto] [place-items:center] [width:40px] [height:40px] [font-size:22px] [color:var(--foreground)] [background:var(--card)] [border:1px_solid_var(--border)] [border-radius:50%] [transition:border-color_160ms] hover:[border-color:var(--primary)] [display:inline-flex] [gap:7px] [align-items:center] [justify-content:center] [min-height:36px] [padding:8px_10px] [font-size:11px] [color:var(--accent)] [background:var(--surface)] [border:1px_solid_var(--line)] [border-radius:8px] hover:[background:var(--accent-soft)] [border-color:var(--accent)] max-[700px]:[&_span]:[display:none] max-[700px]:[min-width:36px]"
            }
            onClick={toggle}
            title={mode === "dark" ? labels.light : labels.dark}
            type="button"
          >
            {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </IconButton>
          <IconButton
            aria-label="Theme settings"
            className="theme-toggle [display:grid] [flex:0_0_auto] [place-items:center] [width:40px] [height:40px] [font-size:22px] [color:var(--foreground)] [background:var(--card)] [border:1px_solid_var(--border)] [border-radius:50%] [transition:border-color_160ms] hover:[border-color:var(--primary)] [display:inline-flex] [gap:7px] [align-items:center] [justify-content:center] [min-height:36px] [padding:8px_10px] [font-size:11px] [color:var(--accent)] [background:var(--surface)] [border:1px_solid_var(--line)] [border-radius:8px] hover:[background:var(--accent-soft)] [border-color:var(--accent)] max-[700px]:[&_span]:[display:none] max-[700px]:[min-width:36px]"
            onClick={() => setOpen(true)}
            type="button"
          >
            <SwatchBook size={18} />
          </IconButton>
        </div>
      </div>
      <DialogContent className="appearance-dialog [width:min(600px,_calc(100vw_-_32px))] [max-width:600px] [max-height:85dvh] [padding:28px] [overflow-y:auto] [color:var(--foreground)] [background:var(--card)] [border:1px_solid_var(--border)] [border-radius:20px] [&_header]:[padding-right:24px] [&_[data-slot='dialog-title']]:[margin-bottom:8px] [&_[data-slot='dialog-description']]:[font-size:13px] [&_>_[data-slot='dialog-close']]:[position:absolute] [&_>_[data-slot='dialog-close']_svg]:[width:16px] [&_>_[data-slot='button']]:[align-self:end]">
        <header>
          <DialogTitle>Make yourself at home</DialogTitle>
          <DialogDescription>
            Choose your colors, typography and space. Sign in to sync your preferences across
            devices.
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

"use client";
import { useState } from "react";

import { SelectField } from "@shared/components/fields";
import type { ColorMode, PortfolioProfile } from "@shared/content";

import { HeroSettingsEditor } from "./hero-settings-editor";
import { ThemePicker } from "./theme-picker";
import { ThemePreview } from "./theme-preview";

export function AppearanceEditor({
  profile,
  onChange,
}: {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
}) {
  const appearance = profile.appearance ?? {
    accent: "cyan",
    defaultTheme: "dark",
  };
  const [previewMode, setPreviewMode] = useState<ColorMode>(
    appearance.defaultTheme === "light" ? "light" : "dark",
  );
  const update = (change: Partial<NonNullable<PortfolioProfile["appearance"]>>) =>
    onChange({ ...profile, appearance: { ...appearance, ...change } });
  return (
    <section>
      <div className="editor-section-heading">
        <div>
          <p className="eyebrow">SET THE MOOD</p>
          <h2>Appearance</h2>
          <p>Choose the feel of your portfolio. Layout, language and CV format stay independent.</p>
        </div>
      </div>
      <div className="editor-card">
        <ThemePicker
          accent={appearance.accent}
          mode={previewMode}
          onChange={(theme) => update({ theme })}
          value={appearance.theme ?? "studio"}
        />
        <div className="editor-fields">
          <SelectField
            label="Default color mode"
            onChange={(value) => {
              update({ defaultTheme: value as typeof appearance.defaultTheme });
              setPreviewMode(value === "light" ? "light" : "dark");
            }}
            value={appearance.defaultTheme}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="system">Match device</option>
          </SelectField>
          <SelectField
            label="Accent color"
            onChange={(accent) => update({ accent: accent as typeof appearance.accent })}
            value={appearance.accent}
          >
            <option value="cyan">Ocean cyan</option>
            <option value="violet">Soft violet</option>
            <option value="emerald">Fresh emerald</option>
          </SelectField>
        </div>
        <div className="theme-preview-tools">
          <h3>Try it with your story</h3>
          <fieldset className="theme-preview-modes">
            <legend className="sr-only">Preview color mode</legend>
            {(["light", "dark"] as const).map((mode) => (
              <button
                aria-pressed={previewMode === mode}
                key={mode}
                onClick={() => setPreviewMode(mode)}
                type="button"
              >
                Preview {mode}
              </button>
            ))}
          </fieldset>
        </div>
        <ThemePreview mode={previewMode} profile={profile} />
        <p className="theme-preview-note">
          Preview controls only change this example. Save changes to apply your theme, accent and
          default mode to your portfolio. Visitors can still choose light or dark mode for
          themselves. Your PDF keeps its own layout and the selected accent.
        </p>
      </div>
      <HeroSettingsEditor onChange={onChange} profile={profile} />
    </section>
  );
}

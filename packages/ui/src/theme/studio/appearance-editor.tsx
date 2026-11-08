"use client";

import { useState } from "react";

import type { ColorMode, PortfolioProfile } from "@shared/config";

import { HeroSettingsEditor } from "../../../../assistant/src/components/sections/hero-section/HeroSettingsEditor";
import { Button } from "../../buttons";
import { Card } from "../../cards";
import { SelectField } from "../../forms";
import { appearanceEditorStyles } from "./styles";
import { ThemePicker } from "./theme-picker";
import { ThemePreview } from "./theme-preview";
import type { AppearanceEditorOptions } from "./types";

export function AppearanceEditor({ profile, onChange }: AppearanceEditorOptions) {
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
      <div className={appearanceEditorStyles.element1}>
        <div>
          <p className={appearanceEditorStyles.element2}>SET THE MOOD</p>
          <h2>Appearance</h2>
          <p>Choose the feel of your portfolio. Layout, language and CV format stay independent.</p>
        </div>
      </div>
      <Card asChild layout="plain" surface="portfolio">
        <div className={appearanceEditorStyles.element3}>
          <ThemePicker
            accent={appearance.accent}
            mode={previewMode}
            onChange={(theme) => update({ theme })}
            value={appearance.theme ?? "studio"}
          />
          <div className={appearanceEditorStyles.element4}>
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
          <div className={appearanceEditorStyles.element5}>
            <h3>Try it with your story</h3>
            <fieldset className={appearanceEditorStyles.element6}>
              <legend className={appearanceEditorStyles.element7}>Preview color mode</legend>
              {(["light", "dark"] as const).map((mode) => (
                <Button
                  aria-pressed={previewMode === mode}
                  key={mode}
                  onClick={() => setPreviewMode(mode)}
                  type="button"
                >
                  Preview {mode}
                </Button>
              ))}
            </fieldset>
          </div>
          <ThemePreview mode={previewMode} profile={profile} />
          <p className={appearanceEditorStyles.element8}>
            Preview controls only change this example. Save changes to apply your theme, accent and
            default mode to your portfolio. Visitors can still choose light or dark mode for
            themselves. Your PDF keeps its own layout and the selected accent.
          </p>
        </div>
      </Card>
      <HeroSettingsEditor onChange={onChange} profile={profile} />
    </section>
  );
}

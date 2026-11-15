"use client";

import { getPortfolioThemeAppearance, type PortfolioTheme } from "@shared/config";
import { themeOptions } from "@shared/config/theme";
import { useThemeStore } from "@shared/runtime/user";

import { Button } from "../buttons/button/Button";
import {
  appearanceLabel,
  appearancePreviewStyle,
  appearanceSample,
  appearanceSections,
  preferenceGroups,
} from "./styles";

function applyPortfolioThemeChoice(value: string) {
  useThemeStore.getState().setThemePreferences({
    ...getPortfolioThemeAppearance(value as PortfolioTheme),
    "portfolio-theme": value,
  });
}

function clearPreference(key: string) {
  useThemeStore.setState((state) => ({
    themePreferences: Object.fromEntries(
      Object.entries(state.themePreferences).filter(([name]) => name !== key),
    ),
  }));
}

function chooseAppearance(preference: string, value: string) {
  if (preference === "portfolio-theme" && value) {
    applyPortfolioThemeChoice(value);
    return;
  }
  if (value) useThemeStore.getState().setThemePreferences({ [preference]: value });
  else clearPreference(preference);
}

function PreferenceField({ preference }: { preference: (typeof preferenceGroups)[number] }) {
  const preferences = useThemeStore((state) => state.themePreferences);
  return (
    <fieldset className="appearance-group">
      <legend>{appearanceLabel(preference)}</legend>
      <div className="appearance-options" data-options={preference}>
        {["", ...(themeOptions[preference] ?? [])].map((value, index) => (
          <Button
            aria-label={`${appearanceLabel(preference)}: ${value || "Page default"}`}
            aria-pressed={(preferences[preference] ?? "") === value}
            className="appearance-choice"
            key={value}
            onClick={() => chooseAppearance(preference, value)}
            type="button"
            variant="unstyled"
          >
            <span
              aria-hidden="true"
              className="appearance-sample"
              data-kind={preference}
              data-value={value}
              style={appearancePreviewStyle(preference, value, index)}
            >
              {appearanceSample(preference, value)}
            </span>
            <span>{appearanceLabel(value || "Page default")}</span>
          </Button>
        ))}
      </div>
    </fieldset>
  );
}

export function AppearanceOptions() {
  const mode = useThemeStore((state) => state.activeMode);
  const grouped = new Set<string>(appearanceSections.flatMap((section) => section.keys));
  const remaining = preferenceGroups.filter((key) => !grouped.has(key));
  return (
    <div className="appearance-visual-options">
      {appearanceSections.map((section) => (
        <section className="appearance-section" key={section.label}>
          <h3>{section.label}</h3>
          {section.label === "Color" ? (
            <fieldset className="appearance-group">
              <legend>Color mode</legend>
              <div className="appearance-options">
                {(["light", "dark", "system"] as const).map((value) => (
                  <Button
                    aria-label={`Mode: ${value}`}
                    aria-pressed={(mode ?? "system") === value}
                    className="appearance-choice"
                    key={value}
                    onClick={() => useThemeStore.getState().setActiveMode(value)}
                    type="button"
                    variant="unstyled"
                  >
                    <span
                      aria-hidden="true"
                      className="appearance-sample"
                      data-kind="mode"
                      data-value={value}
                    >
                      <i />
                      <i />
                      <i />
                    </span>
                    <span>{value}</span>
                  </Button>
                ))}
              </div>
            </fieldset>
          ) : null}
          {section.keys.map((key) => (
            <PreferenceField key={key} preference={key} />
          ))}
        </section>
      ))}
      {remaining.map((key) => (
        <PreferenceField key={key} preference={key} />
      ))}
    </div>
  );
}

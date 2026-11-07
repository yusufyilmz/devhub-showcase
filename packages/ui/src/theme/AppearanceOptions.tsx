"use client";

import { themeOptions } from "@shared/config/theme";
import { useThemeStore } from "@shared/runtime/user";

import { Button } from "../buttons/button/Button";
import {
  appearanceLabel,
  appearancePreviewStyle,
  appearanceSample,
  preferenceGroups,
} from "./styles";

export function AppearanceOptions() {
  const preferences = useThemeStore((state) => state.themePreferences);
  const mode = useThemeStore((state) => state.activeMode);
  return (
    <div className="appearance-visual-options">
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
      {preferenceGroups.map((key) => (
        <fieldset className="appearance-group" key={key}>
          <legend>{appearanceLabel(key)}</legend>
          <div className="appearance-options" data-options={key}>
            {["", ...(themeOptions[key] ?? [])].map((value, index) => (
              <Button
                aria-label={`${appearanceLabel(key)}: ${value || "Page default"}`}
                aria-pressed={(preferences[key] ?? "") === value}
                className="appearance-choice"
                key={value}
                onClick={() => {
                  if (value) useThemeStore.getState().setThemePreferences({ [key]: value });
                  else
                    useThemeStore.setState((state) => ({
                      themePreferences: Object.fromEntries(
                        Object.entries(state.themePreferences).filter(([name]) => name !== key),
                      ),
                    }));
                }}
                type="button"
                variant="unstyled"
              >
                <span
                  aria-hidden="true"
                  className="appearance-sample"
                  data-kind={key}
                  data-value={value}
                  style={appearancePreviewStyle(key, value, index)}
                >
                  {appearanceSample(key, value)}
                </span>
                <span>{appearanceLabel(value || "Page default")}</span>
              </Button>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

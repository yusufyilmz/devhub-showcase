"use client";

import { useEffect, useState } from "react";

import { cn } from "cn";

import { themePreferenceOptions, useUserConfigStore } from "@shared/runtime/user";

import { Button } from "../../buttons/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../cards";
import { Typography } from "../../display/typography";
import { Alert } from "../../feedback/alert";
import { Input } from "../../forms/input";
import { Input as LibraryInput } from "../../forms/input/Input";
import { Label as LibraryLabel } from "../../forms/label/Label";
import { NativeSelect as LibraryNativeSelect } from "../../forms/native-select";
import { TextField } from "../../forms/text-field";
import { FlexBetween, FlexCol, FlexRow } from "../../layout/flex";
import { themeCustomizerStyles } from "../customizers/styles";
import type {
  BrandOption,
  SelectOption,
  ShadowOption,
  SpacingOption,
  ThemeCustomizerOptions,
  ThemeCustomizerProps,
  ThemeOption,
} from "../customizers/types";

export const themeOptions: SelectOption[] = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

export const brandOptions: SelectOption[] = themePreferenceOptions.brand.map((value) => ({
  label: value,
  value,
}));

export const borderOptions: SelectOption[] = themePreferenceOptions.border.map((value) => ({
  label: value,
  value,
}));

export const shadowOptions: SelectOption[] = themePreferenceOptions.shadow.map((value) => ({
  label: value,
  value,
}));

export const spacingOptions: SelectOption[] = themePreferenceOptions.spacing.map((value) => ({
  label: value,
  value,
}));

export const radiusOptions: SelectOption[] = themePreferenceOptions.radius.map((value) => ({
  label: value,
  value,
}));

export const transitionOptions: SelectOption[] = themePreferenceOptions.transition.map((value) => ({
  label: value,
  value,
}));

export const scaleOptions: SelectOption[] = [
  { label: "90% (Compact)", value: "90" },
  { label: "95% (Small)", value: "95" },
  { label: "100% (Default)", value: "100" },
  { label: "105% (Large)", value: "105" },
  { label: "110% (Extra Large)", value: "110" },
];

const SelectField = ({ label, value, options, onChange }: ThemeCustomizerOptions) => (
  <div className={themeCustomizerStyles.element1}>
    <LibraryLabel className={themeCustomizerStyles.element2} unstyled>
      <LibraryInput type="hidden" unstyled value={value} />
      {label}
    </LibraryLabel>
    <LibraryNativeSelect
      className={themeCustomizerStyles.element3}
      onChange={(e) => onChange(e.target.value)}
      unstyled
      value={value}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </LibraryNativeSelect>
  </div>
);

function defaultAttribute(key: string, fallback: string) {
  return typeof document === "undefined"
    ? fallback
    : (document.documentElement.getAttribute(`data-${key}`) ?? fallback);
}

export function ThemeCustomizer({
  className,
  onThemeChange,
  onBrandChange,
  onBorderChange,
  onShadowChange,
  onSpacingChange,
  onRadiusChange,
  onTransitionChange,
  showPreview = true,
  showCode = true,
  showReset = true,
  ...props
}: ThemeCustomizerProps) {
  const preferences = useUserConfigStore((state) => state.themePreferences);
  const theme = useUserConfigStore((state) => state.activeMode) ?? "system";
  const setTheme = (value: ThemeOption) => useUserConfigStore.getState().setActiveMode(value);
  const brand = (preferences.brand ?? defaultAttribute("brand", "white")) as BrandOption;
  const border = preferences.border ?? defaultAttribute("border", "base");
  const shadow = (preferences.shadow ?? defaultAttribute("shadow", "soft")) as ShadowOption;
  const spacing = (preferences.spacing ??
    defaultAttribute("spacing", "comfortable")) as SpacingOption;
  const radius = preferences.radius ?? defaultAttribute("radius", "base");
  const transition = preferences.transition ?? defaultAttribute("transition", "smooth");
  const setBrand = (value: BrandOption) =>
    useUserConfigStore.getState().setThemePreferences({ brand: value });
  const setBorder = (value: string) =>
    useUserConfigStore.getState().setThemePreferences({ border: value });
  const setShadow = (value: ShadowOption) =>
    useUserConfigStore.getState().setThemePreferences({ shadow: value });
  const setSpacing = (value: SpacingOption) =>
    useUserConfigStore.getState().setThemePreferences({ spacing: value });
  const setRadius = (value: string) =>
    useUserConfigStore.getState().setThemePreferences({ radius: value });
  const setTransition = (value: string) =>
    useUserConfigStore.getState().setThemePreferences({ transition: value });
  const [showCodePanel, setShowCodePanel] = useState(showCode);

  // Apply theme changes to document
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyMode = () => {
      const resolved = theme === "system" ? (media.matches ? "dark" : "light") : theme;
      root.setAttribute("data-theme", resolved);
      root.classList.toggle("dark", resolved === "dark");
    };
    applyMode();
    media.addEventListener("change", applyMode);
    root.setAttribute("data-brand", brand);
    root.setAttribute("data-border", border);
    root.setAttribute("data-shadow", shadow);
    root.setAttribute("data-spacing", spacing);
    root.setAttribute("data-radius", radius);
    root.setAttribute("data-transition", transition);

    return () => media.removeEventListener("change", applyMode);
  }, [theme, brand, border, shadow, spacing, radius, transition]);

  const handleThemeChange = (newTheme: ThemeOption) => {
    setTheme(newTheme);
    onThemeChange?.(newTheme);
  };

  const handleBrandChange = (newBrand: BrandOption) => {
    setBrand(newBrand);
    onBrandChange?.(newBrand);
  };

  const handleBorderChange = (newBorder: string) => {
    setBorder(newBorder);
    onBorderChange?.(newBorder);
  };

  const handleShadowChange = (newShadow: ShadowOption) => {
    setShadow(newShadow);
    onShadowChange?.(newShadow);
  };

  const handleSpacingChange = (newSpacing: SpacingOption) => {
    setSpacing(newSpacing);
    onSpacingChange?.(newSpacing);
  };

  const handleRadiusChange = (newRadius: string) => {
    setRadius(newRadius);
    onRadiusChange?.(newRadius);
  };

  const handleTransitionChange = (newTransition: string) => {
    setTransition(newTransition);
    onTransitionChange?.(newTransition);
  };

  const resetToDefaults = () => {
    setTheme("system");
    setBrand("white");
    setBorder("base");
    setShadow("soft");
    setSpacing("comfortable");
    setRadius("base");
    setTransition("smooth");
  };

  const generateCode = () => {
    return `// Theme Configuration
const themeConfig = {
  theme: "${theme}",
  brand: "${brand}",
  border: "${border}",
  shadow: "${shadow}",
  spacing: "${spacing}",
  radius: "${radius}",
  transition: "${transition}"
}

// Apply to document
Object.entries(themeConfig).forEach(([key, value]) => {
  document.documentElement.setAttribute('data-' + key, value)
})`;
  };

  return (
    <div className={cn(themeCustomizerStyles.themeCustomizer, className)} {...props}>
      {/* Header */}
      <FlexBetween>
        <div>
          <Typography className={themeCustomizerStyles.element4} variant="h2">
            Theme Customizer
          </Typography>
          <Typography className={themeCustomizerStyles.element5} variant="body1">
            Customize your design system's appearance and behavior
          </Typography>
        </div>
        <FlexRow gap="sm">
          {showCode && (
            <Button onClick={() => setShowCodePanel(!showCodePanel)} variant="outline">
              {showCodePanel ? "👁️ Hide Code" : "👁️‍🗨️ Show Code"}
            </Button>
          )}
          {showReset && (
            <Button onClick={resetToDefaults} variant="outline">
              🔄 Reset
            </Button>
          )}
        </FlexRow>
      </FlexBetween>

      <FlexRow align="start" gap="lg">
        {/* Controls */}
        <FlexCol className={themeCustomizerStyles.element6} gap="lg">
          {/* Theme & Brand */}
          <Card>
            <CardHeader>
              <CardTitle>Theme & Brand</CardTitle>
              <CardDescription>Choose your color scheme and brand colors</CardDescription>
            </CardHeader>
            <CardContent>
              <FlexRow gap="md">
                <div className={themeCustomizerStyles.element7}>
                  <SelectField
                    label="Theme"
                    onChange={(value) => handleThemeChange(value as ThemeOption)}
                    options={themeOptions}
                    value={theme}
                  />
                </div>
                <div className={themeCustomizerStyles.element8}>
                  <SelectField
                    label="Brand Color"
                    onChange={(value) => handleBrandChange(value as BrandOption)}
                    options={brandOptions}
                    value={brand}
                  />
                </div>
              </FlexRow>
            </CardContent>
          </Card>

          {/* Visual Style */}
          <Card>
            <CardHeader>
              <CardTitle>Visual Style</CardTitle>
              <CardDescription>Customize borders, shadows, and spacing</CardDescription>
            </CardHeader>
            <CardContent>
              <FlexRow gap="md">
                <div className={themeCustomizerStyles.element9}>
                  <SelectField
                    label="Border Style"
                    onChange={handleBorderChange}
                    options={borderOptions}
                    value={border}
                  />
                </div>
                <div className={themeCustomizerStyles.element10}>
                  <SelectField
                    label="Shadow Style"
                    onChange={(value) => handleShadowChange(value as ShadowOption)}
                    options={shadowOptions}
                    value={shadow}
                  />
                </div>
              </FlexRow>
              <FlexRow className={themeCustomizerStyles.element11} gap="md">
                <div className={themeCustomizerStyles.element12}>
                  <SelectField
                    label="Spacing"
                    onChange={(value) => handleSpacingChange(value as SpacingOption)}
                    options={spacingOptions}
                    value={spacing}
                  />
                </div>
                <div className={themeCustomizerStyles.element13}>
                  <SelectField
                    label="Border Radius"
                    onChange={(value) => handleRadiusChange(value)}
                    options={radiusOptions}
                    value={radius}
                  />
                </div>
              </FlexRow>
            </CardContent>
          </Card>

          {/* Interactions */}
          <Card>
            <CardHeader>
              <CardTitle>Interactions</CardTitle>
              <CardDescription>Configure animations and transitions</CardDescription>
            </CardHeader>
            <CardContent>
              <SelectField
                label="Transition Style"
                onChange={handleTransitionChange}
                options={transitionOptions}
                value={transition}
              />
            </CardContent>
          </Card>

          {/* Component Preview */}
          {showPreview && (
            <Card>
              <CardHeader>
                <CardTitle>Component Preview</CardTitle>
                <CardDescription>See how your theme looks with real components</CardDescription>
              </CardHeader>
              <CardContent>
                <FlexCol gap="md">
                  {/* Buttons */}
                  <div>
                    <Typography className={themeCustomizerStyles.element14} variant="h6">
                      Buttons
                    </Typography>
                    <FlexRow gap="sm">
                      <Button variant="default">Default</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="destructive">Destructive</Button>
                    </FlexRow>
                  </div>

                  {/* Cards */}
                  <div>
                    <Typography className={themeCustomizerStyles.element15} variant="h6">
                      Cards
                    </Typography>
                    <FlexRow gap="md">
                      <Card className={themeCustomizerStyles.element16}>
                        <Typography variant="h6">Card Title</Typography>
                        <Typography className={themeCustomizerStyles.element17} variant="body2">
                          This is a sample card with your theme applied.
                        </Typography>
                      </Card>
                      <Card className={themeCustomizerStyles.element18}>
                        <Typography variant="h6">Elevated Card</Typography>
                        <Typography className={themeCustomizerStyles.element19} variant="body2">
                          This card has enhanced shadows.
                        </Typography>
                      </Card>
                    </FlexRow>
                  </div>

                  {/* Form Elements */}
                  <div>
                    <Typography className={themeCustomizerStyles.element20} variant="h6">
                      Form Elements
                    </Typography>
                    <FlexCol className={themeCustomizerStyles.element21} gap="sm">
                      <Input placeholder="Enter your name..." />
                      <TextField placeholder="Enter a message..." />
                      <Button className={themeCustomizerStyles.element22} variant="outline">
                        Submit
                      </Button>
                    </FlexCol>
                  </div>

                  {/* Alerts */}
                  <div>
                    <Typography className={themeCustomizerStyles.element23} variant="h6">
                      Alerts
                    </Typography>
                    <FlexCol gap="sm">
                      <Alert variant="default">
                        <Typography variant="body2">This is a default alert.</Typography>
                      </Alert>
                      <Alert variant="destructive">
                        <Typography variant="body2">This is a destructive alert.</Typography>
                      </Alert>
                    </FlexCol>
                  </div>
                </FlexCol>
              </CardContent>
            </Card>
          )}
        </FlexCol>

        {/* Code Panel */}
        {showCodePanel && (
          <Card className={themeCustomizerStyles.element24}>
            <CardHeader>
              <CardTitle>Generated Code</CardTitle>
              <CardDescription>Copy this code to apply your theme</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className={themeCustomizerStyles.element25}>
                <code>{generateCode()}</code>
              </pre>
              <Button
                className={themeCustomizerStyles.element26}
                onClick={() => navigator.clipboard.writeText(generateCode())}
                size="sm"
                variant="outline"
              >
                📋 Copy Code
              </Button>
            </CardContent>
          </Card>
        )}
      </FlexRow>
    </div>
  );
}

export type {
  BrandOption,
  ScaleOption,
  ShadowOption,
  SpacingOption,
  ThemeCustomizerProps,
  ThemeOption,
} from "../customizers/types";

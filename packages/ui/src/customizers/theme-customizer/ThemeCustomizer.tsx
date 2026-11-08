"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

import { cn } from "cn";

import {
  getPortfolioThemeAppearance,
  getPortfolioThemeVariables,
  type PortfolioTheme,
  portfolioThemes,
} from "@shared/config";
import { themeOptions } from "@shared/config/theme";
import { useThemeStore } from "@shared/runtime/user";

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
import { companionAccentValue } from "../../theme/styles";
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

// export const themeOptions: SelectOption[] = [
//   { label: "Light", value: "light" },
//   { label: "Dark", value: "dark" },
//   { label: "System", value: "system" },
// ];

export const brandOptions: SelectOption[] = themeOptions.brand.map((value) => ({
  label: value,
  value,
}));

export const portfolioThemeOptions: SelectOption[] = [
  { label: "Page default", value: "" },
  ...portfolioThemes.map((theme) => ({ label: theme.name, value: theme.id })),
];

export const borderOptions: SelectOption[] = themeOptions.border.map((value) => ({
  label: value,
  value,
}));

export const shadowOptions: SelectOption[] = themeOptions.shadow.map((value) => ({
  label: value,
  value,
}));

export const spacingOptions: SelectOption[] = themeOptions.spacing.map((value) => ({
  label: value,
  value,
}));

export const radiusOptions: SelectOption[] = themeOptions.radius.map((value) => ({
  label: value,
  value,
}));

export const transitionOptions: SelectOption[] = themeOptions.transition.map((value) => ({
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

function PreferenceSelect({
  label,
  preference,
}: {
  label: string;
  preference: keyof typeof themeOptions;
}) {
  const value = useThemeStore((state) => state.themePreferences[preference] ?? "");
  return (
    <SelectField
      label={label}
      onChange={(next) => {
        if (!next) {
          useThemeStore.setState((state) => ({
            themePreferences: Object.fromEntries(
              Object.entries(state.themePreferences).filter(([name]) => name !== preference),
            ),
          }));
          return;
        }
        useThemeStore.getState().setThemePreferences({ [preference]: next });
      }}
      options={[
        { label: "Page default", value: "" },
        ...themeOptions[preference].map((item) => ({ label: item, value: item })),
      ]}
      value={value}
    />
  );
}

function CustomizerGroup({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <FlexCol gap="md">{children}</FlexCol>
      </CardContent>
    </Card>
  );
}

const documentPreferences = [
  "font",
  "weight",
  "tracking",
  "font-size",
  "line-height",
  "blur",
  "opacity",
  "animation",
  "perspective",
  "container",
  "gradient",
] as const;

function applyStoredPreferences(
  root: HTMLElement,
  preferences: ReturnType<typeof useThemeStore.getState>["themePreferences"],
) {
  if (preferences.companion) {
    root.dataset.companion = preferences.companion;
    root.style.setProperty("--companion-accent", companionAccentValue(preferences.companion));
  }
  for (const key of documentPreferences) {
    const value = preferences[key];
    if (value) root.setAttribute(`data-${key}`, value);
  }
}

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
  const preferences = useThemeStore((state) => state.themePreferences);
  const theme = useThemeStore((state) => state.activeMode) ?? "system";
  const setTheme = (value: ThemeOption) => useThemeStore.getState().setActiveMode(value);
  const brand = (preferences.brand ?? defaultAttribute("brand", "white")) as BrandOption;
  const border = preferences.border ?? defaultAttribute("border", "base");
  const shadow = (preferences.shadow ?? defaultAttribute("shadow", "soft")) as ShadowOption;
  const spacing = (preferences.spacing ??
    defaultAttribute("spacing", "comfortable")) as SpacingOption;
  const radius = preferences.radius ?? defaultAttribute("radius", "base");
  const transition = preferences.transition ?? defaultAttribute("transition", "smooth");
  const portfolioTheme = preferences["portfolio-theme"] ?? "";
  const setBrand = (value: BrandOption) =>
    useThemeStore.getState().setThemePreferences({ brand: value });
  const setBorder = (value: string) =>
    useThemeStore.getState().setThemePreferences({ border: value });
  const setShadow = (value: ShadowOption) =>
    useThemeStore.getState().setThemePreferences({ shadow: value });
  const setSpacing = (value: SpacingOption) =>
    useThemeStore.getState().setThemePreferences({ spacing: value });
  const setRadius = (value: string) =>
    useThemeStore.getState().setThemePreferences({ radius: value });
  const setTransition = (value: string) =>
    useThemeStore.getState().setThemePreferences({ transition: value });
  const setPortfolioTheme = (value: string) => {
    if (!value) {
      useThemeStore.setState((state) => ({
        themePreferences: Object.fromEntries(
          Object.entries(state.themePreferences).filter(([name]) => name !== "portfolio-theme"),
        ),
      }));
      return;
    }
    useThemeStore.getState().setThemePreferences({
      ...getPortfolioThemeAppearance(value as PortfolioTheme),
      "portfolio-theme": value,
    });
  };
  const [showCodePanel, setShowCodePanel] = useState(showCode);
  const rootRef = useRef<HTMLDivElement>(null);

  // Storybook pins data-theme on the preview shell, which overrides the document.
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const preview = rootRef.current?.closest("[data-theme]");
    const shell = preview && preview !== root ? preview : null;
    const previousTheme = shell?.getAttribute("data-theme") ?? null;
    const previousDark = shell?.classList.contains("dark") ?? false;
    const previousPortfolioTheme = root.getAttribute("data-portfolio-theme");
    const portfolioVariables = portfolioTheme
      ? getPortfolioThemeVariables(portfolioTheme as PortfolioTheme)
      : null;
    const previousPortfolioVariables = Object.fromEntries(
      Object.keys(getPortfolioThemeVariables()).map((name) => [
        name,
        root.style.getPropertyValue(name),
      ]),
    );
    const applyMode = () => {
      const resolved = theme === "system" ? (media.matches ? "dark" : "light") : theme;
      for (const element of shell ? [root, shell] : [root]) {
        element.setAttribute("data-theme", resolved);
        element.classList.toggle("dark", resolved === "dark");
      }
    };
    applyMode();
    media.addEventListener("change", applyMode);
    root.setAttribute("data-brand", brand);
    root.setAttribute("data-border", border);
    root.setAttribute("data-shadow", shadow);
    root.setAttribute("data-spacing", spacing);
    root.setAttribute("data-radius", radius);
    root.setAttribute("data-transition", transition);
    if (portfolioVariables) {
      root.dataset.portfolioTheme = portfolioTheme;
      for (const [name, variable] of Object.entries(portfolioVariables))
        root.style.setProperty(name, variable);
    }
    applyStoredPreferences(root, preferences);

    return () => {
      media.removeEventListener("change", applyMode);
      if (shell) {
        if (previousTheme === null) shell.removeAttribute("data-theme");
        else shell.setAttribute("data-theme", previousTheme);
        shell.classList.toggle("dark", previousDark);
      }
      if (previousPortfolioTheme) root.dataset.portfolioTheme = previousPortfolioTheme;
      else root.removeAttribute("data-portfolio-theme");
      for (const [name, variable] of Object.entries(previousPortfolioVariables)) {
        if (variable) root.style.setProperty(name, variable);
        else root.style.removeProperty(name);
      }
    };
  }, [theme, brand, border, shadow, spacing, radius, transition, portfolioTheme, preferences]);

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
    setPortfolioTheme("");
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
  transition: "${transition}",
  portfolioTheme: "${portfolioTheme}"
}

// Apply to document
Object.entries(themeConfig).forEach(([key, value]) => {
  document.documentElement.setAttribute('data-' + key, value)
})`;
  };

  return (
    <div className={cn(themeCustomizerStyles.themeCustomizer, className)} {...props} ref={rootRef}>
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
          <CustomizerGroup description="Color mode, palette, theme, and companion" title="Color">
            <FlexRow gap="md">
              <div className={themeCustomizerStyles.element7}>
                <SelectField
                  label="Color mode"
                  onChange={(value) => handleThemeChange(value as ThemeOption)}
                  options={themeOptions.theme.map((value) => ({
                    label: value,
                    value,
                  }))}
                  value={theme}
                />
              </div>
              <div className={themeCustomizerStyles.element8}>
                <SelectField
                  label="Palette"
                  onChange={(value) => handleBrandChange(value as BrandOption)}
                  options={brandOptions}
                  value={brand}
                />
              </div>
            </FlexRow>
            <SelectField
              label="Theme"
              onChange={setPortfolioTheme}
              options={portfolioThemeOptions}
              value={portfolioTheme}
            />
            <PreferenceSelect label="Companion" preference="companion" />
          </CustomizerGroup>
          <CustomizerGroup description="Typeface, weight, and tracking" title="Font">
            <PreferenceSelect label="Font" preference="font" />
            <PreferenceSelect label="Weight" preference="weight" />
            <PreferenceSelect label="Tracking" preference="tracking" />
          </CustomizerGroup>
          <CustomizerGroup description="Type size, spacing, and corners" title="Size">
            <PreferenceSelect label="Font size" preference="font-size" />
            <PreferenceSelect label="Line height" preference="line-height" />
            <PreferenceSelect label="Scale" preference="scale" />
            <FlexRow gap="md">
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
                  label="Corners"
                  onChange={(value) => handleRadiusChange(value)}
                  options={radiusOptions}
                  value={radius}
                />
              </div>
            </FlexRow>
          </CustomizerGroup>
          <CustomizerGroup description="Borders, shadows, and clarity" title="Surface">
            <FlexRow gap="md">
              <div className={themeCustomizerStyles.element9}>
                <SelectField
                  label="Border"
                  onChange={handleBorderChange}
                  options={borderOptions}
                  value={border}
                />
              </div>
              <div className={themeCustomizerStyles.element10}>
                <SelectField
                  label="Shadow"
                  onChange={(value) => handleShadowChange(value as ShadowOption)}
                  options={shadowOptions}
                  value={shadow}
                />
              </div>
            </FlexRow>
            <PreferenceSelect label="Blur" preference="blur" />
            <PreferenceSelect label="Opacity" preference="opacity" />
          </CustomizerGroup>
          <CustomizerGroup description="Animation and depth" title="Motion">
            <SelectField
              label="Transition"
              onChange={handleTransitionChange}
              options={transitionOptions}
              value={transition}
            />
            <PreferenceSelect label="Animation" preference="animation" />
            <PreferenceSelect label="Perspective" preference="perspective" />
          </CustomizerGroup>

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

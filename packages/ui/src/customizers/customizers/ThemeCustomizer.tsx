"use client";

import { useEffect, useState } from "react";

import { cn } from "cn";

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
import { themeCustomizerStyles } from "./styles";
import type {
  BrandOption,
  SelectOption,
  ShadowOption,
  SpacingOption,
  ThemeCustomizerOptions,
  ThemeCustomizerProps,
  ThemeOption,
} from "./types";

export const themeOptions: SelectOption[] = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

export const brandOptions: SelectOption[] = [
  { label: "White", value: "white" },
  { label: "Sand", value: "sand" },
  { label: "Aqua", value: "aqua" },
];

export const borderOptions: SelectOption[] = [
  { label: "None", value: "none" },
  { label: "Thin", value: "thin" },
  { label: "Base", value: "base" },
  { label: "Thick", value: "thick" },
];

export const shadowOptions: SelectOption[] = [
  { label: "None", value: "none" },
  { label: "Soft", value: "soft" },
  { label: "Medium", value: "medium" },
  { label: "Strong", value: "strong" },
];

export const spacingOptions: SelectOption[] = [
  { label: "Compact", value: "compact" },
  { label: "Comfortable", value: "comfortable" },
  { label: "Relaxed", value: "relaxed" },
  { label: "Spacious", value: "spacious" },
];

export const radiusOptions: SelectOption[] = [
  { label: "Square", value: "square" },
  { label: "Small", value: "small" },
  { label: "Base", value: "base" },
  { label: "Rounded", value: "rounded" },
  { label: "Pill", value: "pill" },
];

export const transitionOptions: SelectOption[] = [
  { label: "None", value: "none" },
  { label: "Base", value: "base" },
  { label: "Smooth", value: "smooth" },
  { label: "Bouncy", value: "bouncy" },
];

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
  const [theme, setTheme] = useState<ThemeOption>("system");
  const [brand, setBrand] = useState<BrandOption>(() => {
    if (typeof document === "undefined") {
      return "white";
    }
    const fromRoot = document.documentElement.getAttribute("data-brand");
    if (fromRoot && brandOptions.some((option) => option.value === fromRoot)) {
      return fromRoot as BrandOption;
    }
    return "white";
  });
  const [border, setBorder] = useState("base");
  const [shadow, setShadow] = useState<ShadowOption>("soft");
  const [spacing, setSpacing] = useState<SpacingOption>(() => {
    if (typeof document === "undefined") {
      return "comfortable";
    }
    const fromRoot = document.documentElement.getAttribute("data-spacing");
    return spacingOptions.some((option) => option.value === fromRoot)
      ? (fromRoot as SpacingOption)
      : "comfortable";
  });
  const [radius, setRadius] = useState(() => {
    if (typeof document === "undefined") {
      return "base";
    }
    return document.documentElement.getAttribute("data-radius") ?? "base";
  });
  const [transition, setTransition] = useState("smooth");
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

    // Store in localStorage
    localStorage.setItem("data-theme", theme);
    localStorage.setItem("data-brand", brand);
    localStorage.setItem("data-border", border);
    localStorage.setItem("data-shadow", shadow);
    localStorage.setItem("data-spacing", spacing);
    localStorage.setItem("data-radius", radius);
    localStorage.setItem("data-transition", transition);
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
} from "./types";

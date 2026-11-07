import type * as React from "react";

import type { VariantProps } from "class-variance-authority";

import type { themeOptions } from "@shared/config/theme";

import type { customizerVariants } from "./styles";

export interface ComponentCustomizerProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof customizerVariants> {
  children: React.ReactNode;
  componentDescription?: string;
  componentName: string;
  onPropsChange?: (props: Record<string, any>) => void;
  propsConfig?: Record<string, any>;
  showCode?: boolean;
  showProps?: boolean;
  showTheme?: boolean;
}

export type ThemeOption = "light" | "dark" | "system";

export type BrandOption = (typeof themeOptions.brand)[number];

export type ShadowOption = (typeof themeOptions.shadow)[number];

export type SpacingOption = (typeof themeOptions.spacing)[number];

export type ScaleOption = "90" | "95" | "100" | "105" | "110";

export type SelectOption = {
  value: string;
  label: string;
};

export interface ThemeCustomizerProps {
  className?: string;
  onBorderChange?: (border: string) => void;
  onBrandChange?: (brand: BrandOption) => void;
  onRadiusChange?: (radius: string) => void;
  onShadowChange?: (shadow: ShadowOption) => void;
  onSpacingChange?: (spacing: SpacingOption) => void;
  onThemeChange?: (theme: ThemeOption) => void;
  onTransitionChange?: (transition: string) => void;
  showCode?: boolean;
  showPreview?: boolean;
  showReset?: boolean;
}

export type ThemeCustomizerOptions = {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
};

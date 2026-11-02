import type { ThemeStore } from "./types";

export type { ThemeStore } from "./types";

import { create } from "zustand";

import { useUserConfigStore } from "@shared/runtime/user";

import type {
  AnimationStyle,
  BlurStyle,
  BorderStyle,
  Brand,
  ContainerStyle,
  FontSizeStyle,
  FontStyle,
  GradientStyle,
  LineHeightStyle,
  OpacityStyle,
  PerspectiveStyle,
  RadiusStyle,
  ScaleStyle,
  ShadowStyle,
  SpacingStyle,
  ThemeConfig,
  ThemeMode,
  TrackingStyle,
  TransitionStyle,
  WeightStyle,
} from "./types";

export const initialState: ThemeConfig = {
  animation: "smooth" as AnimationStyle,
  blur: "medium" as BlurStyle,
  borders: "moderate" as BorderStyle,
  brand: "blue" as Brand,
  container: "small" as ContainerStyle,
  font: "sans" as FontStyle,
  fontSize: "base" as FontSizeStyle,
  gradient: "subtle" as GradientStyle,
  lineHeight: "normal" as LineHeightStyle,
  opacity: "medium" as OpacityStyle,
  perspective: "normal" as PerspectiveStyle,
  radius: "moderate" as RadiusStyle,
  scale: "100" as ScaleStyle,
  shadow: "subtle" as ShadowStyle,
  spacing: "comfortable" as SpacingStyle,
  theme: "system" as ThemeMode,
  tracking: "tight" as TrackingStyle,
  transition: "smooth" as TransitionStyle,
  weight: "normal" as WeightStyle,
};

export const themeStore = create<ThemeStore>()(() => ({
  ...initialState,
  reset: () => commitTheme(initialState),
  setAnimation: (animation: AnimationStyle) => commitTheme({ animation }),
  setBlur: (blur: BlurStyle) => commitTheme({ blur }),
  setBorder: (border: BorderStyle) => commitTheme({ borders: border }),
  setBrand: (brand: Brand) => commitTheme({ brand: brand }),
  setContainer: (container: ContainerStyle) => commitTheme({ container }),
  setFont: (font: FontStyle) => commitTheme({ font }),
  setFontSize: (fontSize: FontSizeStyle) => commitTheme({ fontSize }),
  setGradient: (gradient: GradientStyle) => commitTheme({ gradient: gradient }),
  setLineHeight: (lineHeight: LineHeightStyle) => commitTheme({ lineHeight }),
  setOpacity: (opacity: OpacityStyle) => commitTheme({ opacity }),
  setPerspective: (perspective: PerspectiveStyle) => commitTheme({ perspective }),
  setRadius: (radius: RadiusStyle) => commitTheme({ radius }),
  setScale: (scale: ScaleStyle) => commitTheme({ scale }),
  setSettings: (settings: Partial<ThemeConfig>) => commitTheme({ ...settings }),
  setShadow: (shadow: ShadowStyle) => commitTheme({ shadow: shadow }),
  setSpacing: (spacing: SpacingStyle) => commitTheme({ spacing }),
  setTheme: (theme: ThemeMode) => commitTheme({ theme: theme }),
  setTracking: (tracking: TrackingStyle) => commitTheme({ tracking }),
  setTransition: (transition: TransitionStyle) => commitTheme({ transition }),
  setWeight: (weight: WeightStyle) => commitTheme({ weight: weight }),
}));

export const themeSelectors = {
  border: (state: ThemeStore) => state.borders,
  brand: (state: ThemeStore) => state.brand,
  scale: (state: ThemeStore) => state.scale,
  settings: (state: ThemeStore) => ({
    border: state.borders,
    brand: state.brand,
    scale: state.scale,
    shadow: state.shadow,
    spacing: state.spacing,
    theme: state.theme,
  }),
  shadow: (state: ThemeStore) => state.shadow,
  spacing: (state: ThemeStore) => state.spacing,
  theme: (state: ThemeStore) => state.theme,
};

export const themeActions = {
  reset: () => themeStore.getState().reset(),
  setBorder: (border: BorderStyle) => themeStore.getState().setBorder(border),
  setBrand: (brand: Brand) => themeStore.getState().setBrand(brand),
  setScale: (scale: ScaleStyle) => themeStore.getState().setScale(scale),
  setSettings: (settings: Partial<ThemeConfig>) => themeStore.getState().setSettings(settings),
  setShadow: (shadow: ShadowStyle) => themeStore.getState().setShadow(shadow),
  setSpacing: (spacing: SpacingStyle) => themeStore.getState().setSpacing(spacing),
  setTheme: (theme: ThemeMode) => themeStore.getState().setTheme(theme),
};

export const getThemeSettings = (): ThemeConfig => {
  return {
    ...themeStore.getState(),
  };
};

// Keep the public themeStore API while the user store owns persistence.
const preferenceKey = (key: string) =>
  ({
    borders: "border",
    container: "container",
    fontSize: "font-size",
    lineHeight: "line-height",
  })[key] ?? key;
function commitTheme(settings: Partial<ThemeConfig>) {
  themeStore.setState(settings);
  const changes = Object.fromEntries(
    Object.entries(settings)
      .filter(([key]) => key !== "theme")
      .map(([key, value]) => [preferenceKey(key), value]),
  );
  if (Object.keys(changes).length) useUserConfigStore.getState().setThemePreferences(changes);
  if (settings.theme) useUserConfigStore.getState().setActiveMode(settings.theme);
}
useUserConfigStore.subscribe((state) => {
  const settings = Object.fromEntries(
    Object.keys(initialState)
      .filter(
        (key) =>
          key !== "theme" &&
          state.themePreferences[preferenceKey(key) as keyof typeof state.themePreferences] !==
            undefined,
      )
      .map((key) => [
        key,
        state.themePreferences[preferenceKey(key) as keyof typeof state.themePreferences],
      ]),
  );
  themeStore.setState({
    ...initialState,
    ...settings,
    ...(state.activeMode ? { theme: state.activeMode } : {}),
  } as Partial<ThemeConfig>);
});

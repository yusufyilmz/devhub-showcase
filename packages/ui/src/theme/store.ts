import type { ThemeStore } from "./types";

export type { ThemeStore } from "./types";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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

export const themeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      ...initialState,
      reset: () => set(initialState),
      setAnimation: (animation: AnimationStyle) => set({ animation }),
      setBlur: (blur: BlurStyle) => set({ blur }),
      setBorder: (border: BorderStyle) => set({ borders: border }),
      setBrand: (brand: Brand) => set({ brand: brand }),
      setContainer: (container: ContainerStyle) => set({ container }),
      setFont: (font: FontStyle) => set({ font }),
      setFontSize: (fontSize: FontSizeStyle) => set({ fontSize }),
      setGradient: (gradient: GradientStyle) => set({ gradient: gradient }),
      setLineHeight: (lineHeight: LineHeightStyle) => set({ lineHeight }),
      setOpacity: (opacity: OpacityStyle) => set({ opacity }),
      setPerspective: (perspective: PerspectiveStyle) => set({ perspective }),
      setRadius: (radius: RadiusStyle) => set({ radius }),
      setScale: (scale: ScaleStyle) => set({ scale }),
      setSettings: (settings: Partial<ThemeConfig>) => set({ ...settings }),
      setShadow: (shadow: ShadowStyle) => set({ shadow: shadow }),
      setSpacing: (spacing: SpacingStyle) => set({ spacing }),
      setTheme: (theme: ThemeMode) => set({ theme: theme }),
      setTracking: (tracking: TrackingStyle) => set({ tracking }),
      setTransition: (transition: TransitionStyle) => set({ transition }),
      setWeight: (weight: WeightStyle) => set({ weight: weight }),
    }),
    {
      name: "ui-theme",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

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

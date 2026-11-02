export const themeToggleStyles = {
  element1: "theme-toggle",
} as const;
export const themeSettingsStyles = {
  field: "theme-settings-field",
  panel: "theme-settings-panel",
};

export const appearanceGroups = [
  { key: "accent", label: "Accent", values: ["cyan", "violet", "emerald"] },
  { key: "font", label: "Font", values: ["sans", "serif", "mono"] },
  { key: "spacing", label: "Spacing", values: ["compact", "comfortable", "spacious"] },
  { key: "radius", label: "Corners", values: ["square", "rounded", "pill"] },
] as const;

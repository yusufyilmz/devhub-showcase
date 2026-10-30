export const portfolioThemes = [
  {
    description: "The original cool palette and crisp cards.",
    id: "studio",
    name: "Studio",
  },
  {
    description: "Warm surfaces, serif titles and a printed feel.",
    id: "paper",
    name: "Paper",
  },
  {
    description: "Neutral surfaces, monospaced titles and sharp edges.",
    id: "graphite",
    name: "Graphite",
  },
  {
    description: "Soft lavender surfaces, rounded cards and a relaxed feel.",
    id: "bloom",
    name: "Bloom",
  },
] as const;
export type PortfolioTheme = (typeof portfolioThemes)[number]["id"];
export type ColorMode = "light" | "dark";
type Palette = {
  bg: string;
  surface: string;
  soft: string;
  text: string;
  muted: string;
  border: string;
  shadow: string;
};
const palettes: Record<PortfolioTheme, Record<ColorMode, Palette>> = {
  bloom: {
    dark: {
      bg: "23 20 35",
      border: "76 62 100",
      muted: "183 172 207",
      shadow: "0 0 0",
      soft: "44 36 62",
      surface: "34 29 49",
      text: "244 239 255",
    },
    light: {
      bg: "248 245 255",
      border: "211 194 231",
      muted: "104 85 126",
      shadow: "97 64 129",
      soft: "237 229 250",
      surface: "255 253 255",
      text: "44 33 62",
    },
  },
  graphite: {
    dark: {
      bg: "19 19 21",
      border: "68 68 76",
      muted: "174 174 183",
      shadow: "0 0 0",
      soft: "36 36 40",
      surface: "28 28 31",
      text: "240 240 242",
    },
    light: {
      bg: "245 245 245",
      border: "197 197 204",
      muted: "93 93 103",
      shadow: "45 45 55",
      soft: "232 232 234",
      surface: "255 255 255",
      text: "28 28 31",
    },
  },
  paper: {
    dark: {
      bg: "28 25 23",
      border: "85 75 62",
      muted: "190 178 160",
      shadow: "0 0 0",
      soft: "48 43 39",
      surface: "39 35 32",
      text: "247 241 229",
    },
    light: {
      bg: "249 245 235",
      border: "212 199 177",
      muted: "106 94 76",
      shadow: "88 68 40",
      soft: "237 231 217",
      surface: "255 252 245",
      text: "45 39 31",
    },
  },
  studio: {
    dark: {
      bg: "9 15 26",
      border: "43 60 81",
      muted: "160 177 198",
      shadow: "0 0 0",
      soft: "22 34 52",
      surface: "16 25 41",
      text: "234 241 249",
    },
    light: {
      bg: "246 248 251",
      border: "207 220 231",
      muted: "83 105 129",
      shadow: "60 84 110",
      soft: "236 242 248",
      surface: "255 255 255",
      text: "25 42 61",
    },
  },
};
const shape = {
  bloom: { display: "system-ui, sans-serif", radius: "28px", weight: "500" },
  graphite: {
    display: 'ui-monospace, "SFMono-Regular", monospace',
    radius: "2px",
    weight: "500",
  },
  paper: {
    display: 'Georgia, "Times New Roman", serif',
    radius: "4px",
    weight: "400",
  },
  studio: { display: "system-ui, sans-serif", radius: "16px", weight: "600" },
};
export function getThemePalette(theme: PortfolioTheme, mode: ColorMode) {
  return palettes[theme][mode];
}
export function getPortfolioThemeVariables(theme: PortfolioTheme = "studio") {
  const variables: Record<string, string> = {};
  for (const mode of ["light", "dark"] as const) {
    for (const [key, value] of Object.entries(palettes[theme][mode]))
      variables[`--portfolio-${key}-${mode}`] = value;
  }
  variables["--portfolio-radius"] = shape[theme].radius;
  variables["--portfolio-display"] = shape[theme].display;
  variables["--portfolio-heading-weight"] = shape[theme].weight;
  return variables;
}
export const portfolioAccents = {
  cyan: { dark: "103 216 231", light: "13 110 132" },
  emerald: { dark: "98 220 183", light: "14 113 86" },
  violet: { dark: "184 165 255", light: "111 69 177" },
};
export function getPreviewAccent(accent: keyof typeof portfolioAccents) {
  return {
    "--portfolio-accent-dark": portfolioAccents[accent].dark,
    "--portfolio-accent-light": portfolioAccents[accent].light,
  };
}

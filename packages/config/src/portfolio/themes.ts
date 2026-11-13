export const portfolioThemes = [
  {
    description: "The original cool palette and crisp cards.",
    id: "studio",
    name: "Studio",
    swatch: "dark",
  },
  {
    description: "Warm surfaces, serif titles and a printed feel.",
    id: "paper",
    name: "Paper",
    swatch: "light",
  },
  {
    description: "Neutral surfaces, monospaced titles and sharp edges.",
    id: "graphite",
    name: "Graphite",
    swatch: "dark",
  },
  {
    description: "Soft lavender surfaces, rounded cards and a relaxed feel.",
    id: "bloom",
    name: "Bloom",
    swatch: "light",
  },
  {
    description: "Dim plum surfaces, tight corners and a quiet mood.",
    id: "gloom",
    name: "Gloom",
    swatch: "dark",
  },
  {
    description: "Black and ivory, square edges and a heavy serif.",
    id: "ink",
    name: "Ink",
    swatch: "light",
  },
  {
    description: "Sun-warm sand, soft corners and a printed warmth.",
    id: "dune",
    name: "Dune",
    swatch: "light",
  },
  {
    description: "Deep sea navy, compact cards and a steady sans.",
    id: "harbor",
    name: "Harbor",
    swatch: "dark",
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
  dune: {
    dark: {
      bg: "30 22 14",
      border: "98 72 46",
      muted: "196 170 140",
      shadow: "0 0 0",
      soft: "56 42 28",
      surface: "44 32 20",
      text: "250 236 216",
    },
    light: {
      bg: "247 240 226",
      border: "214 186 146",
      muted: "122 88 58",
      shadow: "110 70 30",
      soft: "236 222 198",
      surface: "255 250 241",
      text: "58 36 18",
    },
  },
  gloom: {
    dark: {
      bg: "14 12 18",
      border: "62 52 74",
      muted: "168 158 180",
      shadow: "0 0 0",
      soft: "36 30 46",
      surface: "24 20 30",
      text: "236 230 242",
    },
    light: {
      bg: "244 242 246",
      border: "206 198 216",
      muted: "96 86 110",
      shadow: "40 30 55",
      soft: "232 228 238",
      surface: "255 254 255",
      text: "28 22 36",
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
  harbor: {
    dark: {
      bg: "6 18 28",
      border: "34 68 90",
      muted: "148 178 196",
      shadow: "0 0 0",
      soft: "18 40 56",
      surface: "12 28 42",
      text: "226 242 248",
    },
    light: {
      bg: "240 247 250",
      border: "186 210 222",
      muted: "64 98 114",
      shadow: "24 64 84",
      soft: "224 238 244",
      surface: "255 255 255",
      text: "14 40 54",
    },
  },
  ink: {
    dark: {
      bg: "12 12 12",
      border: "70 70 68",
      muted: "176 176 170",
      shadow: "0 0 0",
      soft: "32 32 32",
      surface: "22 22 22",
      text: "245 245 242",
    },
    light: {
      bg: "250 249 246",
      border: "186 184 176",
      muted: "90 90 86",
      shadow: "20 20 16",
      soft: "238 236 230",
      surface: "255 255 255",
      text: "16 16 16",
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
  dune: { display: 'Palatino, "Palatino Linotype", Georgia, serif', radius: "14px", weight: "500" },
  gloom: { display: "system-ui, sans-serif", radius: "6px", weight: "600" },
  graphite: {
    display: 'ui-monospace, "SFMono-Regular", monospace',
    radius: "2px",
    weight: "500",
  },
  harbor: { display: "system-ui, sans-serif", radius: "8px", weight: "600" },
  ink: { display: 'Georgia, "Times New Roman", serif', radius: "0px", weight: "700" },
  paper: {
    display: 'Georgia, "Times New Roman", serif',
    radius: "4px",
    weight: "400",
  },
  studio: { display: "system-ui, sans-serif", radius: "16px", weight: "600" },
};
const themeAppearance = {
  bloom: {
    border: "none",
    font: "sans",
    "line-height": "relaxed",
    radius: "pill",
    shadow: "soft",
    spacing: "spacious",
    tracking: "tight",
    weight: "medium",
  },
  dune: {
    border: "thin",
    font: "serif",
    "line-height": "relaxed",
    radius: "rounded",
    shadow: "soft",
    spacing: "spacious",
    tracking: "tight",
    weight: "medium",
  },
  gloom: {
    border: "thin",
    font: "sans",
    "line-height": "snug",
    radius: "small",
    shadow: "strong",
    spacing: "compact",
    tracking: "wide",
    weight: "semibold",
  },
  graphite: {
    border: "base",
    font: "mono",
    "line-height": "snug",
    radius: "square",
    shadow: "none",
    spacing: "compact",
    tracking: "wide",
    weight: "medium",
  },
  harbor: {
    border: "base",
    font: "sans",
    "line-height": "normal",
    radius: "small",
    shadow: "medium",
    spacing: "comfortable",
    tracking: "tight",
    weight: "semibold",
  },
  ink: {
    border: "thick",
    font: "serif",
    "line-height": "tight",
    radius: "none",
    shadow: "none",
    spacing: "compact",
    tracking: "wide",
    weight: "bold",
  },
  paper: {
    border: "thin",
    font: "serif",
    "line-height": "relaxed",
    radius: "small",
    shadow: "none",
    spacing: "spacious",
    tracking: "tight",
    weight: "normal",
  },
  studio: {
    border: "thin",
    font: "sans",
    "line-height": "normal",
    radius: "rounded",
    shadow: "soft",
    spacing: "comfortable",
    tracking: "tight",
    weight: "semibold",
  },
} as const satisfies Record<PortfolioTheme, Record<string, string>>;
export function getPortfolioThemeAppearance(theme: PortfolioTheme) {
  return themeAppearance[theme];
}
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
function rgbParts(hex: string): string {
  const normalized = hex.replace("#", "");
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

function previewAccent(darkHex: string, lightHex: string) {
  return { dark: rgbParts(darkHex), light: rgbParts(lightHex) };
}

/** Published-page accent previews (dark = on studio canvas, light = on light canvas). */
export const portfolioAccents = {
  aqua: previewAccent("#53d4d3", "#0c6367"),
  blue: previewAccent("#97baff", "#033cf8"),
  cyan: { dark: "103 216 231", light: "13 110 132" },
  emerald: { dark: "98 220 183", light: "14 113 86" },
  gray: previewAccent("#b2b2b2", "#595959"),
  green: previewAccent("#53d47c", "#0c6731"),
  indigo: previewAccent("#b9adfc", "#7058d8"),
  magenta: previewAccent("#dc98fd", "#9902b3"),
  moss: previewAccent("#86b849", "#6b2d09"),
  orange: previewAccent("#ff9964", "#ac2401"),
  pink: previewAccent("#fd8be4", "#ae0169"),
  red: previewAccent("#ff9689", "#b6020c"),
  sand: previewAccent("#b7b2a4", "#5e594c"),
  slate: previewAccent("#acb2c8", "#52586f"),
  violet: { dark: "184 165 255", light: "111 69 177" },
  yellow: previewAccent("#fe9c0b", "#924205"),
} as const;

export type PortfolioAccentId = keyof typeof portfolioAccents;

export const portfolioAccentIds = [
  "red",
  "orange",
  "yellow",
  "moss",
  "green",
  "emerald",
  "aqua",
  "cyan",
  "blue",
  "indigo",
  "violet",
  "magenta",
  "pink",
  "sand",
  "gray",
  "slate",
] as const satisfies readonly PortfolioAccentId[];

export function getPreviewAccent(accent: PortfolioAccentId) {
  return {
    "--portfolio-accent-dark": portfolioAccents[accent].dark,
    "--portfolio-accent-light": portfolioAccents[accent].light,
  };
}

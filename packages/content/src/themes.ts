export const portfolioThemes = [
  {
    id: 'studio',
    name: 'Studio',
    description: 'The original cool palette and crisp cards.'
  },
  {
    id: 'paper',
    name: 'Paper',
    description: 'Warm surfaces, serif titles and a printed feel.'
  },
  {
    id: 'graphite',
    name: 'Graphite',
    description: 'Neutral surfaces, monospaced titles and sharp edges.'
  },
  {
    id: 'bloom',
    name: 'Bloom',
    description: 'Soft lavender surfaces, rounded cards and a relaxed feel.'
  }
] as const
export type PortfolioTheme = (typeof portfolioThemes)[number]['id']
export type ColorMode = 'light' | 'dark'
type Palette = {
  bg: string
  surface: string
  soft: string
  text: string
  muted: string
  border: string
  shadow: string
}
const palettes: Record<PortfolioTheme, Record<ColorMode, Palette>> = {
  studio: {
    dark: {
      bg: '9 15 26',
      surface: '16 25 41',
      soft: '22 34 52',
      text: '234 241 249',
      muted: '160 177 198',
      border: '43 60 81',
      shadow: '0 0 0'
    },
    light: {
      bg: '246 248 251',
      surface: '255 255 255',
      soft: '236 242 248',
      text: '25 42 61',
      muted: '83 105 129',
      border: '207 220 231',
      shadow: '60 84 110'
    }
  },
  paper: {
    dark: {
      bg: '28 25 23',
      surface: '39 35 32',
      soft: '48 43 39',
      text: '247 241 229',
      muted: '190 178 160',
      border: '85 75 62',
      shadow: '0 0 0'
    },
    light: {
      bg: '249 245 235',
      surface: '255 252 245',
      soft: '237 231 217',
      text: '45 39 31',
      muted: '106 94 76',
      border: '212 199 177',
      shadow: '88 68 40'
    }
  },
  graphite: {
    dark: {
      bg: '19 19 21',
      surface: '28 28 31',
      soft: '36 36 40',
      text: '240 240 242',
      muted: '174 174 183',
      border: '68 68 76',
      shadow: '0 0 0'
    },
    light: {
      bg: '245 245 245',
      surface: '255 255 255',
      soft: '232 232 234',
      text: '28 28 31',
      muted: '93 93 103',
      border: '197 197 204',
      shadow: '45 45 55'
    }
  },
  bloom: {
    dark: {
      bg: '23 20 35',
      surface: '34 29 49',
      soft: '44 36 62',
      text: '244 239 255',
      muted: '183 172 207',
      border: '76 62 100',
      shadow: '0 0 0'
    },
    light: {
      bg: '248 245 255',
      surface: '255 253 255',
      soft: '237 229 250',
      text: '44 33 62',
      muted: '104 85 126',
      border: '211 194 231',
      shadow: '97 64 129'
    }
  }
}
const shape = {
  studio: { radius: '16px', display: 'system-ui, sans-serif', weight: '600' },
  paper: {
    radius: '4px',
    display: 'Georgia, "Times New Roman", serif',
    weight: '400'
  },
  graphite: {
    radius: '2px',
    display: 'ui-monospace, "SFMono-Regular", monospace',
    weight: '500'
  },
  bloom: { radius: '28px', display: 'system-ui, sans-serif', weight: '500' }
}
export function getThemePalette(theme: PortfolioTheme, mode: ColorMode) {
  return palettes[theme][mode]
}
export function getPortfolioThemeVariables(theme: PortfolioTheme = 'studio') {
  const variables: Record<string, string> = {}
  for (const mode of ['light', 'dark'] as const) {
    for (const [key, value] of Object.entries(palettes[theme][mode]))
      variables[`--portfolio-${key}-${mode}`] = value
  }
  variables['--portfolio-radius'] = shape[theme].radius
  variables['--portfolio-display'] = shape[theme].display
  variables['--portfolio-heading-weight'] = shape[theme].weight
  return variables
}
export const portfolioAccents = {
  cyan: { dark: '103 216 231', light: '13 110 132' },
  violet: { dark: '184 165 255', light: '111 69 177' },
  emerald: { dark: '98 220 183', light: '14 113 86' }
}
export function getPreviewAccent(accent: keyof typeof portfolioAccents) {
  return {
    '--portfolio-accent-light': portfolioAccents[accent].light,
    '--portfolio-accent-dark': portfolioAccents[accent].dark
  }
}

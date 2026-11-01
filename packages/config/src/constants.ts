// Professional styling inspired by Magic Portfolio
export const style = {
  accent: "red", // red for dynamic contrast like Magic Portfolio
  border: "playful", // rounded | playful | conservative - friendly, approachable
  brand: "cyan", // cyan for modern, tech-forward look like Magic Portfolio
  neutral: "gray", // sand | gray | slate
  scaling: "100", // 90 | 95 | 100 | 105 | 110
  solid: "contrast", // color | contrast | inverse
  solidStyle: "flat", // flat | plastic - clean, modern appearance
  surface: "translucent", // filled | translucent - sophisticated depth
  theme: "system", // dark | light | system - follows user preference
  transition: "all", // all | micro | macro - smooth interactions
};

export const dataStyle = {
  axis: {
    stroke: "var(--neutral-alpha-weak)",
  },
  height: 24, // default chart height
  mode: "categorical", // categorical | divergent | sequential
  tick: {
    fill: "var(--neutral-on-background-weak)",
    fontSize: 11,
    line: false,
  },
  variant: "gradient", // flat | gradient | outline
};

// Enhanced visual effects following Magic Portfolio patterns
export const effects = {
  dots: {
    color: "brand-background-strong",
    display: true, // Enable dots pattern like Magic Portfolio
    opacity: 40,
    size: "2",
  },
  gradient: {
    colorEnd: "page-background",
    colorStart: "accent-background-strong",
    display: false, // Keep subtle for professional look
    height: 50,
    opacity: 100,
    tilt: 0,
    width: 100,
    x: 50,
    y: 60,
  },
  grid: {
    color: "neutral-alpha-medium",
    display: false,
    height: "0.25rem",
    opacity: 100,
    width: "0.25rem",
  },
  lines: {
    angle: 45,
    color: "neutral-alpha-weak",
    display: false,
    opacity: 100,
    size: "16",
    thickness: 1,
  },
  mask: {
    cursor: false,
    radius: 100,
    x: 50,
    y: 0,
  },
};

export const CHATSIZE = {
  chanelAvatar: {
    default: 30,
    max: 50,
    min: 25,
  },
  default: {
    height: 520,
    width: 400,
  },
  max: {
    height: 768,
    width: 1920,
  },
  min: {
    height: 150,
    width: 100,
  },
};

function landscape(sky: string, ground: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="${sky}"/><path fill="${ground}" d="M0 360V270L150 110l95 95 95-55 180 115 120-90v185Z"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const cardStoryImages = {
  evening: landscape("#44346a", "#262045"),
  morning: landscape("#c9e8fa", "#477598"),
  noon: landscape("#f0db9b", "#a65f4f"),
};

import { groupEntries } from "./utils";

export const portfolioVisitorFeatures = groupEntries("Explore this portfolio", [
  [
    "sections",
    "Explore the portfolio",
    "Use the page navigation to jump to the published sections you want to read.",
  ],
  [
    "visitor-chat",
    "Ask about published work",
    "If you want, I can help you find information about the work and experience published here.",
  ],
  [
    "visitor-cv",
    "Download the public CV",
    "Looking for a copy? Use the portfolio’s CV download when it is available.",
  ],
  [
    "theme",
    "Change the page appearance",
    "Use the appearance control to switch the theme for your visit.",
  ],
  [
    "create",
    "Create a portfolio",
    "Want your own portfolio and CV? Visit MyDevStudio to see the layouts and get started.",
    undefined,
    "/",
    "Open MyDevStudio",
  ],
]);

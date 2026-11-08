import type { PortfolioProfile } from "@shared/config";

import { validateProfile } from "./profile";

export function createEmptyProfile(user: {
  email?: string;
  user_metadata?: Record<string, unknown>;
}): PortfolioProfile {
  const name = user.user_metadata?.full_name ?? user.user_metadata?.name;
  return validateProfile({
    about: [],
    appearance: { accent: "cyan", defaultTheme: "system" },
    cvUrl: "/cv.pdf",
    education: [],
    email: user.email,
    experiences: [],
    github: "",
    languages: [],
    linkedin: "",
    location: "Add your location",
    name: typeof name === "string" && name.trim() ? name.trim().slice(0, 200) : "Your name",
    phone: "",
    projects: [],
    skills: {},
    summary: "Add a short professional summary.",
    templateChosen: false,
    title: "Add your professional title",
    website: "",
  });
}

import type { PortfolioProfile } from "@shared/config";

import type { CompletionItem } from "./types";

export function portfolioCompletion(profile: PortfolioProfile): CompletionItem[] {
  return [
    {
      complete: Boolean(profile.name.trim()),
      essential: true,
      label: "Full name",
      reason: "Help visitors identify you.",
      tab: "Profile",
    },
    {
      complete: Boolean(profile.title.trim()),
      essential: true,
      label: "Professional title",
      reason: "Explain the work you do.",
      tab: "Profile",
    },
    {
      complete: Boolean(profile.summary.trim()),
      essential: true,
      label: "Short introduction",
      reason: "Give visitors a clear first impression.",
      tab: "Profile",
    },
    {
      complete: Boolean(profile.email.trim()),
      essential: false,
      label: "Public email",
      reason: "Offer a way to contact you if you want to share it.",
      tab: "Profile",
    },
    {
      complete: profile.projects.some((item) => item.public !== false && Boolean(item.name.trim())),
      essential: false,
      label: "Projects",
      reason: "Show examples of your work.",
      tab: "Projects",
    },
    {
      complete: profile.experiences.some((item) => Boolean(item.company?.trim())),
      essential: false,
      label: "Experience",
      reason: "Explain your experience and contribution.",
      tab: "Experience",
    },
    {
      complete: Object.values(profile.skills).some((items) => items.some((item) => item.trim())),
      essential: false,
      label: "Skills",
      reason: "Make your strengths easy to scan.",
      tab: "Skills",
    },
  ];
}

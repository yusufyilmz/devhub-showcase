import {
  formatPortfolioPeriod,
  getPortfolioCopy,
  type PortfolioProfile,
  projectPublicProfile,
} from "@shared/config";

const cvFormats = {
  ats: {
    cvLineHeight: 1.2,
    cvNameSize: 23,
    cvPageMargins: [44, 40, 44, 44],
    cvSectionMargin: [0, 14, 0, 5],
    cvTitleSize: 12,
  },
  "ats-compact": {
    cvLineHeight: 1.08,
    cvNameSize: 23,
    cvPageMargins: [36, 30, 36, 36],
    cvSectionMargin: [0, 10, 0, 4],
    cvTitleSize: 12,
  },
  classic: {
    cvLineHeight: 1.2,
    cvNameSize: 25,
    cvPageMargins: [44, 36, 44, 44],
    cvSectionMargin: [0, 15, 0, 7],
    cvTitleSize: 12,
  },
  compact: {
    cvLineHeight: 1.08,
    cvNameSize: 22,
    cvPageMargins: [36, 28, 36, 36],
    cvSectionMargin: [0, 10, 0, 5],
    cvTitleSize: 12,
  },
  editorial: {
    cvLineHeight: 1.2,
    cvNameSize: 34,
    cvPageMargins: [50, 48, 50, 48],
    cvSectionMargin: [0, 22, 0, 10],
    cvTitleSize: 14,
  },
};
export function createCvData(input: PortfolioProfile) {
  const profile = projectPublicProfile(input, "cv");
  return {
    ...profile,
    labels: getPortfolioCopy(profile.cvLanguage),
    ...cvFormats[profile.cvLayout ?? "classic"],
    cvAccent:
      profile.appearance?.accent === "violet"
        ? "#6f45b1"
        : profile.appearance?.accent === "emerald"
          ? "#0e7156"
          : "#096b83",
    cvFontSize: profile.cvSettings?.fontSize ?? 9,
    cvPageSize: profile.cvSettings?.pageSize ?? "A4",
    education: profile.education.map((item) => ({
      ...item,
      period: formatPortfolioPeriod(item.start, item.end, profile.cvLanguage),
    })),
    email: profile.cvSettings?.showEmail === false ? "" : profile.email,
    emailLink: `mailto:${profile.email}`,
    experiences: profile.experiences.map((item) => ({
      ...item,
      period: formatPortfolioPeriod(item.start, item.end, profile.cvLanguage),
    })),
    languages: profile.cvSettings?.includeLanguages === false ? [] : profile.languages,
    phone: profile.cvSettings?.showPhone === false ? "" : profile.phone,
    projects:
      profile.cvSettings?.includeProjects === false
        ? []
        : profile.projects.filter((item) => item.public),
    skillGroups: Object.entries(profile.skills).map(([name, values]) => ({
      description: values.join(", "),
      name,
    })),
  };
}

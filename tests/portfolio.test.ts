import { describe, expect, it } from "vitest";

import { createCVModel } from "../packages/chat/src/models/cv-model";
import { formatAllCV, formatters } from "../packages/chat/src/services/formatter";
import { profile } from "../packages/content/src/profile";
import { getPortfolioResources } from "../packages/lib/src/services/portfolio";
import { formatDateRange } from "../packages/lib/src/utils/date/format";

const CV_MODEL = createCVModel(profile);

describe("CV content and portfolio mapping", () => {
  it("shows the current dLocal role first and preserves career chronology", () => {
    const resources = getPortfolioResources();
    expect(resources.experiences[0]).toMatchObject({
      finishedAt: null,
      role: "Software Engineer III (Frontend-focused Full Stack)",
      startedAt: "2024-12-01",
    });
    expect(resources.experiences.map((item) => item.company.name)).toEqual([
      "dLocal",
      "Toptal",
      "Scopely",
      "Marfeel",
      "Turkcell Global Bilgi",
      "SESTEK",
    ]);
    expect(resources.experiences.map((item) => item.startedAt)).toEqual(
      [...resources.experiences.map((item) => item.startedAt)].sort().reverse(),
    );
  });
  it("places personal projects in the public showcase and professional work inside its employer", () => {
    const resources = getPortfolioResources();
    expect(resources.projects.map((item) => item.link)).toEqual([
      "https://yusuf-fitness-os.vercel.app",
      "https://yusufdevhub.vercel.app",
    ]);
    expect(resources.projects.every((item) => item.sourceUrl?.startsWith(profile.github))).toBe(
      true,
    );
    expect(resources.experiences[0]?.projects.map((item) => item.id)).toContain(
      "bank-movements-classifier",
    );
    expect(
      resources.experiences.find((item) => item.id === "toptal")?.projects.map((item) => item.id),
    ).toContain("assets-generator");
  });
  it("shares verified experience, projects and languages with the AI without inventing skill durations", () => {
    const prompt = formatAllCV(CV_MODEL);
    expect(prompt).toContain(profile.summary);
    expect(prompt).toContain("dLocal");
    expect(prompt).toContain("Yusuf Fitness OS");
    expect(prompt).toContain("Spanish (Intermediate)");
    expect(prompt).not.toMatch(/2024 years|10-20 legacy|Nazmi Soner/);
    expect(formatters.contact(CV_MODEL.contact)).toContain(profile.phone);
    expect(formatters.contact(CV_MODEL.contact)).not.toContain("[object Object]");
  });
  it("does not invent education GPAs missing from the supplied CV", () => {
    expect(getPortfolioResources().educations.every((item) => item.gpa === null)).toBe(true);
  });
  it("renders an ongoing job as Present and keeps dates consistent across timezones", () => {
    expect(formatDateRange("2024-12-01", null)).toBe("Dec 2024 - Present");
    expect(formatDateRange("2021-10-01", "2024-10-01")).toBe("Oct 2021 - Oct 2024");
  });
});

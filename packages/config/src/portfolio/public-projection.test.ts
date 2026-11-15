import { describe, expect, it } from "vitest";

import { profile } from "../profile/profile";
import { projectPublicProfile } from "./public-projection";

describe("publishable output projections", () => {
  it("removes excluded fields and records from website data without changing the independent CV", () => {
    const source = {
      ...profile,
      birthDate: "1990-01-01",
      projects: profile.projects.map((item, index) => ({ ...item, public: index !== 0 })),
      sectionSettings: { experience: { visible: false } },
      websiteFields: { email: false, location: false },
    };
    const web = projectPublicProfile(source, "website");
    const cv = projectPublicProfile(source, "cv");
    expect(web.email).toBe("");
    expect(web.location).toBe("");
    expect(web.birthDate).toBeUndefined();
    expect(web.experiences).toEqual([]);
    expect(web.projects.some((item) => item.id === source.projects[0]!.id)).toBe(false);
    expect(web.projects.every((item) => item.experienceId === null)).toBe(true);
    expect(cv.email).toBe(source.email);
    expect(cv.experiences).toEqual(source.experiences);
    expect(source.email).toBe(profile.email);
    expect(source.projects[0]!.public).toBe(false);
  });
  it("honors CV exclusions independently of website visibility and existing settings", () => {
    const source = {
      ...profile,
      cvFields: { email: false, website: false },
      cvSettings: {
        fontSize: 9 as const,
        includeLanguages: false,
        includeProjects: false,
        pageSize: "A4" as const,
        showEmail: true,
        showPhone: false,
      },
    };
    const cv = projectPublicProfile(source, "cv");
    expect(cv.email).toBe("");
    expect(cv.website).toBe("");
    expect(cv.phone).toBe("");
    expect(cv.projects).toEqual([]);
    expect(cv.languages).toEqual([]);
    expect(projectPublicProfile(source, "website").email).toBe(source.email);
  });
});

describe("custom source privacy", () => {
  it("does not retain dormant source records, excluded IDs or hidden section links", () => {
    const hiddenId = "custom-11111111-1111-4111-8111-111111111111" as const;
    const publicId = "custom-22222222-2222-4222-8222-222222222222" as const;
    const source = {
      ...profile,
      customSections: [
        {
          id: hiddenId,
          items: [],
          renderer: "cards" as const,
          title: "Private notes",
          visible: false,
        },
        {
          id: publicId,
          items: [
            { body: "Secret dormant source", id: "draft", title: "Dormant private text", url: "" },
          ],
          renderer: "cards" as const,
          source: {
            field: "projects" as const,
            itemIds: [profile.projects[0]!.id],
            type: "profile" as const,
          },
          title: "Selected projects",
          visible: true,
        },
      ],
      sectionSequence: [
        ...(["about", "experience", "projects", "skills", "education", "languages"] as const),
        hiddenId,
        publicId,
      ],
      sectionSettings: { projects: { visible: false } },
    };
    const web = projectPublicProfile(source, "website");
    expect(JSON.stringify(web)).not.toContain("Secret dormant source");
    expect(JSON.stringify(web)).not.toContain("Private notes");
    expect(web.customSections?.[0]?.source?.itemIds).toEqual([]);
    expect(web.sectionSequence).not.toContain(hiddenId);
    expect(source.customSections[1]!.items).toHaveLength(1);
  });
});

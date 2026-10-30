import { expect, it } from "vitest";

import { profile } from "../packages/content/src/profile";
import { profileSchema } from "../packages/lib/src/domain/profile";

it("keeps legacy portfolios on the original layout without onboarding", () => {
  const saved = profileSchema.parse(profile);
  expect(saved.portfolioType).toBe("engineer");
  expect(saved.cvLayout).toBe("classic");
  expect(saved.templateChosen).toBe(true);
});
it("rejects unknown templates and unsafe project covers", () => {
  expect(profileSchema.safeParse({ ...profile, portfolioType: "unknown" }).success).toBe(false);
  expect(profileSchema.safeParse({ ...profile, cvLayout: "unknown" }).success).toBe(false);
  expect(
    profileSchema.safeParse({
      ...profile,
      projects: [{ ...profile.projects[0], coverImage: "javascript:alert(1)" }],
    }).success,
  ).toBe(false);
});

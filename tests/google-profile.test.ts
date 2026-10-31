import { expect, it } from "vitest";

import { profile } from "../packages/content/src/index";
import {
  applyGoogleProfile,
  googleProfileReviewSchema,
  reviewGooglePerson,
} from "../packages/lib/src/domain/google-profile";
import { validateProfile } from "../packages/lib/src/domain/profile";

it("maps self profile data without copying street addresses or inventing employment dates", () => {
  const review = reviewGooglePerson({
    addresses: [
      {
        city: "Barcelona",
        country: "Spain",
        postalCode: "PRIVATE_POSTAL",
        region: "Catalonia",
        streetAddress: "PRIVATE_STREET",
      },
    ],
    birthdays: [{ date: { day: 10, month: 2, year: 1990 } }],
    emailAddresses: [{ value: "alex@example.test" }],
    genders: [{ value: "PRIVATE_GENDER" }],
    names: [{ familyName: "Morgan", givenName: "Alex" }],
    organizations: [
      { current: true, name: "Current School", title: "Student", type: "school" },
      { current: false, name: "Old Company", title: "Old Role" },
      { current: true, name: "Studio", title: "Designer" },
    ],
    phoneNumbers: [
      { value: "other" },
      { canonicalForm: "+34600000000", metadata: { primary: true } },
    ],
  });
  expect(review.suggestions).toContainEqual({ field: "name", value: "Alex Morgan" });
  expect(review.suggestions).toContainEqual({
    field: "location",
    value: "Barcelona, Catalonia, Spain",
  });
  expect(review.suggestions).toContainEqual({ field: "phone", value: "+34600000000" });
  expect(review.suggestions).toContainEqual({ field: "title", value: "Designer" });
  expect(review.suggestions).toContainEqual({ field: "birthDate", value: "1990-02-10" });
  expect(review.workplace).toBe("Studio");
  expect(JSON.stringify(review)).not.toContain("PRIVATE_");
  const next = applyGoogleProfile(profile, review, ["name"]);
  expect(next.name).toBe("Alex Morgan");
  expect(next.email).toBe(profile.email);
  expect(next.experiences).toEqual(profile.experiences);
  expect(next.birthDate).toBeUndefined();
  expect(applyGoogleProfile(profile, review, ["birthDate"]).birthDate).toBe("1990-02-10");
  expect(profile.name).not.toBe("Alex Morgan");
});
it("preserves legacy profiles and rejects impossible, future or partial birthdates", () => {
  expect(validateProfile(profile).birthDate).toBeUndefined();
  for (const date of [
    { day: 10, month: 2 },
    { day: 31, month: 2, year: 1990 },
    { day: 1, month: 1, year: 2999 },
  ]) {
    expect(reviewGooglePerson({ birthdays: [{ date }] }).suggestions).toEqual([]);
    expect(reviewGooglePerson({ birthdays: [{ date }] }).notes).toHaveLength(2);
  }
  expect(() => validateProfile({ ...profile, birthDate: "2999-01-01" })).toThrow();
  expect(() => validateProfile({ ...profile, birthDate: "1990-02-31" })).toThrow();
  expect(reviewGooglePerson({}).suggestions).toEqual([]);
});
it("allows only selected supported fields and never imports sharing or executable data", () => {
  expect(() =>
    googleProfileReviewSchema.parse({
      notes: [],
      suggestions: [{ field: "isPublic", value: "true" }],
    }),
  ).toThrow();
  const review = reviewGooglePerson({ emailAddresses: [{ value: "invalid email" }] });
  expect(() => applyGoogleProfile(profile, review, ["email"])).toThrow();
  expect(applyGoogleProfile(profile, review, []).email).toBe(profile.email);
});

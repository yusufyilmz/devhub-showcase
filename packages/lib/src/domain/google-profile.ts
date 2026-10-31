import type { PortfolioProfile } from "@shared/content";
import { z } from "zod";

import { validateProfile } from "./profile";

export const googleImportFields = [
  "name",
  "email",
  "location",
  "phone",
  "title",
  "birthDate",
] as const;
export type GoogleImportField = (typeof googleImportFields)[number];
export const googleProfileReviewSchema = z
  .object({
    notes: z.array(z.string().max(500)).max(10),
    suggestions: z
      .array(
        z.object({ field: z.enum(googleImportFields), value: z.string().trim().max(200) }).strict(),
      )
      .max(6),
    workplace: z.string().max(200).optional(),
  })
  .strict()
  .refine(
    (value) =>
      new Set(value.suggestions.map((item) => item.field)).size === value.suggestions.length,
    "Duplicate suggested field",
  );
export type GoogleProfileReview = z.infer<typeof googleProfileReviewSchema>;
const metadata = z.object({ primary: z.boolean().optional() }).optional();
const items = <T extends z.ZodType>(schema: T) => z.array(schema).max(100).optional().default([]);
const personSchema = z.object({
  addresses: items(
    z.object({
      city: z.string().optional(),
      country: z.string().optional(),
      metadata,
      region: z.string().optional(),
    }),
  ),
  birthdays: items(
    z.object({
      date: z
        .object({
          day: z.number().int().optional(),
          month: z.number().int().optional(),
          year: z.number().int().optional(),
        })
        .optional(),
      metadata,
    }),
  ),
  emailAddresses: items(z.object({ metadata, value: z.string() })),
  names: items(
    z.object({
      displayName: z.string().optional(),
      familyName: z.string().optional(),
      givenName: z.string().optional(),
      metadata,
    }),
  ),
  organizations: items(
    z.object({
      current: z.boolean().optional(),
      metadata,
      name: z.string().optional(),
      title: z.string().optional(),
      type: z.string().optional(),
    }),
  ),
  phoneNumbers: items(
    z.object({ canonicalForm: z.string().optional(), metadata, value: z.string().optional() }),
  ),
});
function primary<T extends { metadata?: { primary?: boolean } }>(entries: T[]) {
  return entries.find((entry) => entry.metadata?.primary) ?? entries[0];
}
function birthDate(date: { year?: number; month?: number; day?: number } | undefined) {
  if (!date?.year || !date.month || !date.day) return undefined;
  const value = `${String(date.year).padStart(4, "0")}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value &&
    parsed <= new Date()
    ? value
    : undefined;
}
/** Only explicitly mapped self-profile fields survive; never copy the Google response. */
export function reviewGooglePerson(raw: unknown): GoogleProfileReview {
  const person = personSchema.parse(raw);
  const name = primary(person.names);
  const address = primary(person.addresses);
  const phone = primary(person.phoneNumbers);
  const organization = primary(
    person.organizations.filter((entry) => entry.current === true && entry.type !== "school"),
  );
  const values = {
    birthDate: birthDate(primary(person.birthdays)?.date),
    email: primary(person.emailAddresses)?.value,
    location: [...new Set([address?.city, address?.region, address?.country].filter(Boolean))].join(
      ", ",
    ),
    name: name?.displayName || [name?.givenName, name?.familyName].filter(Boolean).join(" "),
    phone: phone?.canonicalForm || phone?.value,
    title: organization?.title,
  };
  return googleProfileReviewSchema.parse({
    notes: [
      "Missing details are left blank. Google is not a complete CV source.",
      ...(person.birthdays.length && !values.birthDate
        ? ["Google did not share a complete valid birthdate; none will be imported."]
        : []),
    ],
    suggestions: googleImportFields.flatMap((field) =>
      values[field]?.trim() ? [{ field, value: values[field]?.trim() }] : [],
    ),
    ...(organization?.name ? { workplace: organization.name } : {}),
  });
}
/** Whitelist scalar fields and validate the full draft again; never save or publish. */
export function applyGoogleProfile(
  base: PortfolioProfile,
  review: GoogleProfileReview,
  selected: GoogleImportField[],
) {
  const parsed = googleProfileReviewSchema.parse(review);
  const fields = new Set(z.array(z.enum(googleImportFields)).max(6).parse(selected));
  const changes = Object.fromEntries(
    parsed.suggestions
      .filter((item) => fields.has(item.field))
      .map((item) => [item.field, item.value]),
  );
  return validateProfile({ ...base, ...changes });
}

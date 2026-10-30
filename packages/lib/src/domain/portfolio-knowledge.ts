import {
  getPortfolioSections,
  type Language,
  type PortfolioProfile,
  resolveSectionSource,
  selectPortfolioContent,
} from "@shared/content";
import { z } from "zod";

import type { ProfileSnapshot } from "../repositories/profile-repository";

export type KnowledgeSource = {
  profileId: string;
  username: string;
  revision: number;
  updatedAt: string;
};
export type KnowledgeItem = {
  id: string;
  title: string;
  body: string;
  details?: string[];
  url?: string;
  period?: string;
  value?: string;
};
export type KnowledgeSection = { id: string; title: string; items: KnowledgeItem[] };
export type PublicPortfolioKnowledge = {
  schemaVersion: 1;
  audience: "public";
  source: KnowledgeSource;
  language: Language;
  identity: Pick<PortfolioProfile, "name" | "title" | "summary" | "location">;
  contact: Pick<PortfolioProfile, "email" | "phone" | "website" | "github" | "linkedin">;
  sections: KnowledgeSection[];
};
export type OwnerPortfolioKnowledge = {
  schemaVersion: 1;
  audience: "owner";
  source: KnowledgeSource;
  profile: PortfolioProfile;
};
function source(snapshot: ProfileSnapshot): KnowledgeSource {
  if (!snapshot.id || !snapshot.username)
    throw new Error("A saved portfolio identity is required.");
  return {
    profileId: snapshot.id,
    revision: snapshot.revision,
    updatedAt: snapshot.updatedAt,
    username: snapshot.username,
  };
}
/** Call only after authorizing the owner/manager; never pass this to public chat. */
export function buildOwnerPortfolioKnowledge(snapshot: ProfileSnapshot): OwnerPortfolioKnowledge {
  return {
    audience: "owner",
    profile: structuredClone(snapshot.profile),
    schemaVersion: 1,
    source: source(snapshot),
  };
}
/** A deterministic projection of current published content, not an LLM summary. */
export function buildPublicPortfolioKnowledge(
  snapshot: ProfileSnapshot,
): PublicPortfolioKnowledge | null {
  if (!snapshot.isPublic) return null;
  const profile = selectPortfolioContent(snapshot.profile);
  const { name, title, summary, location, email, phone, website, github, linkedin } = profile;
  const sections = getPortfolioSections(profile)
    .filter((section) => section.settings.visible)
    .map((section) => ({
      id: section.id,
      items: builtinItems(profile, section.kind),
      title: section.kind,
    }))
    .filter((section) => section.items.length > 0);
  const custom = (snapshot.profile.customSections ?? [])
    .filter((section) => section.visible)
    .map((section) => {
      const resolved = resolveSectionSource(section, snapshot.profile);
      return {
        id: section.id,
        items: [
          ...(section.options?.description
            ? [
                {
                  body: section.options.description,
                  id: `${section.id}-description`,
                  title: section.title,
                },
              ]
            : []),
          ...resolved.items.map(({ id, title, body, details, url, period, value }) => ({
            body,
            details,
            id,
            period,
            title,
            url,
            value,
          })),
        ],
        title: section.title,
      };
    });
  return {
    audience: "public",
    contact: { email, github, linkedin, phone, website },
    identity: { location, name, summary, title },
    language: profile.portfolioLanguage ?? "en",
    schemaVersion: 1,
    sections: [...sections, ...custom],
    source: source(snapshot),
  };
}
function builtinItems(profile: PortfolioProfile, kind: string): KnowledgeItem[] {
  switch (kind) {
    case "about":
      return profile.about.map((body, index) => ({ body, id: `about-${index}`, title: "About" }));
    case "experience":
      return profile.experiences.map((item) => ({
        body: item.company,
        details: item.achievements,
        id: item.id,
        period: `${item.start} to ${item.end ?? "Present"}`,
        title: item.position,
        url: item.companyUrl,
      }));
    case "education":
      return profile.education.map((item) => ({
        body: item.institution,
        id: item.id,
        period: `${item.start} to ${item.end}`,
        title: `${item.degree} ${item.field}`,
        url: item.url,
      }));
    case "projects":
      return profile.projects.map((item) => ({
        body: item.description,
        details: [item.company, ...item.skills],
        id: item.id,
        title: item.name,
        url: item.url ?? item.sourceUrl ?? "",
      }));
    case "skills":
      return Object.entries(profile.skills).map(([title, details]) => ({
        body: "",
        details,
        id: title,
        title,
      }));
    case "languages":
      return profile.languages.map((item) => ({
        body: item.proficiency,
        id: item.id,
        title: item.language,
      }));
    default:
      return [];
  }
}

// Whitelist again at the provider boundary so extra internal fields cannot leak
// through structurally compatible objects or accidental object spreads.
const string = z.string();
const itemSchema = z.object({
  body: string,
  details: z.array(string).optional(),
  id: string,
  period: string.optional(),
  title: string,
  url: string.optional(),
  value: string.optional(),
});
const publicKnowledgeSchema = z.object({
  audience: z.literal("public"),
  contact: z.object({
    email: string,
    github: string,
    linkedin: string,
    phone: string,
    website: string,
  }),
  identity: z.object({ location: string, name: string, summary: string, title: string }),
  language: z.enum(["en", "es", "tr"]),
  schemaVersion: z.literal(1),
  sections: z
    .array(z.object({ id: string, items: z.array(itemSchema).max(100), title: string }))
    .max(66),
  source: z.object({
    profileId: string,
    revision: z.number().int().min(1),
    updatedAt: string,
    username: string,
  }),
});
export function serializePublicKnowledge(knowledge: PublicPortfolioKnowledge) {
  return JSON.stringify(publicKnowledgeSchema.parse(knowledge));
}

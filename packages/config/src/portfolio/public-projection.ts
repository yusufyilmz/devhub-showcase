import type { PortfolioProfile } from "../profile/profile";
import { selectPortfolioContent } from "../sections/section-content";

export const contactFields = [
  "email",
  "phone",
  "location",
  "website",
  "github",
  "linkedin",
] as const;
export type ContactField = (typeof contactFields)[number];
export type OutputFields = Partial<Record<ContactField, boolean>>;

/** Produce publishable data, never just a renderer flag. The caller still authorizes publication. */
export function projectPublicProfile(
  source: PortfolioProfile,
  surface: "website" | "cv",
): PortfolioProfile {
  const profile = structuredClone(source);
  profile.birthDate = undefined;
  profile.cvUrl = undefined;
  const fields = surface === "website" ? profile.websiteFields : profile.cvFields;
  for (const key of contactFields) if (fields?.[key] === false) profile[key] = "";
  profile.projects = profile.projects.filter((item) => item.public);
  if (surface === "cv") projectCv(profile);
  else projectWebsite(profile);
  const experiences = new Set(profile.experiences.map((item) => item.id));
  profile.projects = profile.projects.map((item) =>
    item.experienceId && !experiences.has(item.experienceId)
      ? { ...item, experienceId: null }
      : item,
  );
  return profile;
}
function projectCv(profile: PortfolioProfile) {
  if (profile.cvSettings?.showEmail === false) profile.email = "";
  if (profile.cvSettings?.showPhone === false) profile.phone = "";
  if (profile.cvSettings?.includeProjects === false) profile.projects = [];
  if (profile.cvSettings?.includeLanguages === false) profile.languages = [];
  profile.customSections = undefined;
  profile.hero = undefined;
  profile.sectionSequence = undefined;
  profile.sectionOrder = undefined;
  profile.sectionSettings = undefined;
}
function projectWebsite(profile: PortfolioProfile) {
  const selected = selectPortfolioContent(profile);
  const visible = (kind: keyof NonNullable<PortfolioProfile["sectionSettings"]>) =>
    profile.sectionSettings?.[kind]?.visible !== false;
  profile.about = visible("about") ? profile.about : [];
  profile.projects = visible("projects") ? selected.projects : [];
  profile.education = visible("education") ? selected.education : [];
  profile.experiences = visible("experience") ? selected.experiences : [];
  profile.languages = visible("languages") ? selected.languages : [];
  profile.skills = visible("skills") ? selected.skills : {};
  for (const setting of Object.values(profile.sectionSettings ?? {})) setting.itemIds = undefined;
  pruneCustomSources(profile);
}
function pruneCustomSources(profile: PortfolioProfile) {
  const allowed = {
    about: new Set(["about"]),
    education: new Set(profile.education.map((item) => item.id)),
    experiences: new Set(profile.experiences.map((item) => item.id)),
    languages: new Set(profile.languages.map((item) => item.id)),
    projects: new Set(profile.projects.map((item) => item.id)),
    skills: new Set(Object.keys(profile.skills)),
  };
  profile.customSections = (profile.customSections ?? [])
    .filter((section) => section.visible)
    .filter(
      (section) => !(section.sectionType === "map" && profile.websiteFields?.location === false),
    )
    .map((section) => {
      if (section.source) {
        section.items = [];

        section.source.itemIds = section.source.itemIds?.filter((id) =>
          allowed[section.source?.field as keyof typeof allowed].has(id),
        );
      }
      if (profile.websiteFields?.email === false && section.options?.email)
        section.options.email = undefined;
      return section;
    });
  const ids = new Set(profile.customSections.map((section) => section.id));
  profile.sectionSequence = profile.sectionSequence?.filter(
    (id) => !id.startsWith("custom-") || ids.has(id as `custom-${string}`),
  );
}

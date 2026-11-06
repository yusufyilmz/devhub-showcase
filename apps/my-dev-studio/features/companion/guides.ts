import {
  type PortfolioProfile,
  portfolioVisitorFeatures,
  studioCompanionFeatures,
} from "@shared/config";
import type { ProfileSnapshot } from "@shared/services/profile";
import type { AgentFeature, AgentGuide } from "@shared/ui/agent-companion";

export const studioHomeGuide: AgentGuide = {
  context: "Home",
  features: studioCompanionFeatures,
  id: "studio",
  progressHref: "/api/companion-progress",
  title: "MyDevStudio feature guide",
};

export const portfolioGuide: AgentGuide = {
  features: portfolioVisitorFeatures,
  id: "portfolio",
  title: "Portfolio visitor guide",
};

const missingFields = [
  {
    id: "name",
    label: "name",
    missing: (p: PortfolioProfile) => !p.name.trim(),
    prompt: "Help me decide how to display my name on my portfolio. Ask me for my name first.",
  },
  {
    id: "title",
    label: "professional title",
    missing: (p: PortfolioProfile) => !p.title.trim() || p.title === "Add your professional title",
    prompt:
      "Help me draft a professional title. Ask me what kind of work I do if you need details.",
  },
  {
    id: "summary",
    label: "short introduction",
    missing: (p: PortfolioProfile) =>
      !p.summary.trim() || p.summary === "Add a short professional summary.",
    prompt:
      "Help me draft a short portfolio introduction from my experience. Ask me for missing facts.",
  },
  {
    id: "about",
    label: "About section",
    missing: (p: PortfolioProfile) => !p.about.some((line) => line.trim()),
    prompt:
      "Help me write an About section from my existing profile. Ask me before adding any facts.",
  },
  {
    id: "experience",
    label: "experience section",
    missing: (p: PortfolioProfile) => !p.experiences.length,
    prompt:
      "Help me describe my first role and achievements. Ask me for details about my role and results.",
  },
  {
    id: "projects",
    label: "projects section",
    missing: (p: PortfolioProfile) => !p.projects.length,
    prompt:
      "Help me write up a project for my portfolio. Ask me about my role, what I built, and the outcome.",
  },
  {
    id: "education",
    label: "education section",
    missing: (p: PortfolioProfile) => !p.education.length,
    prompt:
      "Help me add my education. Ask me for the qualifications and dates rather than guessing.",
  },
  {
    id: "skills",
    label: "skills section",
    missing: (p: PortfolioProfile) => !Object.values(p.skills).some((group) => group.length),
    prompt: "Help me group the skills I can demonstrate. Ask me which ones I use.",
  },
  {
    id: "languages",
    label: "spoken languages",
    missing: (p: PortfolioProfile) => !p.languages.length,
    prompt:
      "Help me describe my spoken languages and proficiency. Ask me which languages I speak and my level.",
  },
];

function editingTip(
  id: string,
  title: string,
  message: string,
  prompt: string,
  ask: (prompt: string) => void,
): AgentFeature {
  return {
    action: { label: "Draft with Studio", onSelect: () => ask(prompt) },
    group: "Draft suggestions",
    id,
    message,
    title,
  };
}

function usedStudioFeatures(saved: ProfileSnapshot) {
  const { profile } = saved;
  const evidence = {
    appearance: Boolean(profile.hero),
    career: Boolean(profile.experiences.length),
    "custom-sections": Boolean(profile.customSections?.length),
    "draft-save": saved.revision > 1,
    education: Boolean(profile.education.length),
    "field-visibility": [
      ...Object.values(profile.websiteFields ?? {}),
      ...Object.values(profile.cvFields ?? {}),
    ].includes(false),
    languages: Boolean(profile.languages.length),
    layout: profile.templateChosen === true,
    locale: [profile.portfolioLanguage, profile.cvLanguage].some(
      (language) => language && language !== "en",
    ),
    projects: Boolean(profile.projects.length),
    publication: saved.isPublic === true,
    "section-display": Boolean(Object.keys(profile.sectionSettings ?? {}).length),
    sharing: Boolean(profile.publicationVisibility && profile.publicationVisibility !== "public"),
    skills: Boolean(Object.values(profile.skills).some((group) => group.length)),
    "visual-order": Boolean(profile.sectionSequence?.length),
    workspace: true,
  };
  return Object.keys(evidence).filter((id) => evidence[id as keyof typeof evidence]);
}

export function studioEditorGuide({
  draft,
  saved,
  tab,
  ask,
  preview,
  paused,
  managed,
}: {
  draft: PortfolioProfile;
  saved: ProfileSnapshot;
  tab: string;
  ask: (prompt: string) => void;
  preview: () => void;
  paused: boolean;
  managed: boolean;
}): AgentGuide | undefined {
  if (managed) return undefined;
  const suggestions = missingFields
    .filter(({ missing }) => missing(draft))
    .map(({ id, label, prompt }) =>
      editingTip(
        `missing-${id}`,
        `Add your ${label}`,
        `If you want, I can help you fill in your ${label} using the details you provide.`,
        prompt,
        ask,
      ),
    );
  return {
    ...studioHomeGuide,
    context: tab,
    features: studioCompanionFeatures.map((feature) =>
      feature.id === "visual-order"
        ? {
            ...feature,
            action: { label: "Open draft preview", onSelect: preview },
            message:
              "By the way, you can drag sections into a new order. Open the draft preview and choose Arrange sections. Your PDF keeps its own layout.",
          }
        : feature,
    ),
    followUps: [
      editingTip(
        `refresh-summary-${saved.revision}`,
        "Review your introduction",
        "If you want, I can help make your introduction more specific to the work you want next.",
        "Suggest a clearer introduction based on my current portfolio. Keep the facts unchanged.",
        ask,
      ),
      editingTip(
        `refresh-projects-${saved.revision}`,
        "Review your project descriptions",
        "Want a second look at your projects? I can suggest where to make your role or the outcome clearer.",
        "Review my project descriptions. Suggest clearer wording and ask for missing results without inventing them.",
        ask,
      ),
    ],
    observed: usedStudioFeatures(saved),
    paused,
    suggestions,
  };
}

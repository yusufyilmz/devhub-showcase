import { formatPortfolioPeriod, getPortfolioCopy, type PortfolioProfile } from "@shared/content";
import Handlebars from "handlebars";
import pdfmake from "pdfmake";
import fonts from "pdfmake/build/vfs_fonts.js";
import type { TDocumentDefinitions } from "pdfmake/interfaces";

// The server and Plop share an in-memory font filesystem; no host font paths.
const virtualfs = (
  pdfmake as typeof pdfmake & {
    virtualfs: { writeFileSync: (path: string, data: Buffer) => void };
  }
).virtualfs;
for (const [name, data] of Object.entries(fonts)) {
  virtualfs.writeFileSync(name, Buffer.from(data, "base64"));
}
pdfmake.addFonts({
  Roboto: {
    bold: "Roboto-Medium.ttf",
    bolditalics: "Roboto-MediumItalic.ttf",
    italics: "Roboto-Italic.ttf",
    normal: "Roboto-Regular.ttf",
  },
});
// CVs contain text and links only. Never fetch assets supplied by profile data.
pdfmake.setUrlAccessPolicy(() => false);
pdfmake.setLocalAccessPolicy(() => false);

/** Shared with Plop so JSON escaping is identical in CLI and website output. */
export const cvHelpers = {
  json: (value: unknown) => JSON.stringify(value ?? ""),
};

const cvFormats = {
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
export function createCvData(profile: PortfolioProfile) {
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

export function createCvDefinition(
  profile: PortfolioProfile,
  template: string,
  render?: (template: string, data: ReturnType<typeof createCvData>) => string,
): TDocumentDefinitions {
  const data = createCvData(profile);
  const engine = Handlebars.create();
  engine.registerHelper(cvHelpers);
  const json = render
    ? render(template, data)
    : engine.compile(template, { noEscape: true, strict: true })(data);
  const definition = JSON.parse(json) as TDocumentDefinitions;
  definition.info = {
    author: profile.name,
    creator: "DevHub CV template",
    subject: profile.title,
    title: `${profile.name} | ${data.labels.cv}`,
  };
  definition.pageBreakBefore = (node, queries) =>
    node.headlineLevel === 1 && queries.getFollowingNodesOnPage().length === 0;
  definition.footer = (page, count) => ({
    color: "#64748b",
    columns: [
      { alignment: "left", text: profile.name },
      { alignment: "right", text: `${page} / ${count}` },
    ],
    fontSize: 8,
    margin: [44, 14, 44, 0],
  });
  return definition;
}

export async function renderCv(
  profile: PortfolioProfile,
  template: string,
  render?: Parameters<typeof createCvDefinition>[2],
): Promise<Buffer> {
  return pdfmake.createPdf(createCvDefinition(profile, template, render)).getBuffer();
}

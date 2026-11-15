import type { Content } from "pdfmake/interfaces";

import type { createCvData } from "./data";

/** One-column, selectable text. No sidebars, icons, tables or image assets. */
export function atsContent(data: ReturnType<typeof createCvData>): Content[] {
  const heading = (text: string): Content => ({
    bold: true,
    fontSize: 12,
    headlineLevel: 1,
    margin: [0, 14, 0, 5],
    text,
  });
  const label = (text: string): Content => ({
    bold: true,
    headlineLevel: 1,
    margin: [0, 6, 0, 3],
    text,
  });
  const paragraph = (text: string): Content => ({ margin: [0, 0, 0, 5], text });
  const links = [data.website, data.github, data.linkedin].filter(Boolean);
  return [
    { bold: true, fontSize: 23, margin: [0, 0, 0, 5], text: data.name },
    paragraph(data.title),
    paragraph([data.location, data.email, data.phone].filter(Boolean).join(" | ")),
    ...links.map((url) => ({ link: url, margin: [0, 0, 0, 4], text: url }) as Content),
    paragraph(data.summary),
    ...(data.experiences.length
      ? [
          heading(data.labels.cvExperience),
          ...data.experiences.flatMap((item) => [
            label(`${item.position} — ${item.company}`),
            paragraph(item.period),
            ...item.achievements.map((text) => paragraph(`• ${text}`)),
          ]),
        ]
      : []),
    ...(data.projects.length
      ? [
          heading(data.labels.cvProjects),
          ...data.projects.flatMap((item) => [
            label(item.name),
            paragraph(item.description),
            paragraph(item.skills.join(", ")),
            ...[item.url, item.sourceUrl]
              .filter((url): url is string => Boolean(url))
              .map((url) => ({ link: url, margin: [0, 0, 0, 4], text: url }) as Content),
          ]),
        ]
      : []),
    ...(data.education.length
      ? [
          heading(data.labels.cvEducation),
          ...data.education.flatMap((item) => [
            label(`${item.degree} — ${item.field}`),
            paragraph(item.institution),
            paragraph(item.period),
          ]),
        ]
      : []),
    ...(data.skillGroups.length
      ? [
          heading(data.labels.cvSkills),
          ...data.skillGroups.map((item) => paragraph(`${item.name}: ${item.description}`)),
        ]
      : []),
    ...(data.languages.length
      ? [
          heading(data.labels.cvLanguages),
          ...data.languages.map((item) => paragraph(`${item.language}: ${item.proficiency}`)),
        ]
      : []),
  ];
}

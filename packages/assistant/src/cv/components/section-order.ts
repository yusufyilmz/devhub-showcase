import type { Content, TDocumentDefinitions } from "pdfmake/interfaces";

import type { createCvData } from "./data";

export function orderCvContent(
  definition: TDocumentDefinitions,
  data: ReturnType<typeof createCvData>,
  order?: string[],
) {
  if (!order || !Array.isArray(definition.content)) return;
  const labels: Record<string, string> = {
    education: data.labels.cvEducation,
    experience: data.labels.cvExperience,
    languages: data.labels.cvLanguages,
    projects: data.labels.cvProjects,
    skills: data.labels.cvSkills,
  };
  const sections = new Map<string, Content[]>();
  const header: Content[] = [];
  let current = header;
  for (const node of definition.content) {
    const title = typeof node === "object" && node && "text" in node ? node.text : null;
    const sectionHeading =
      typeof node === "object" &&
      node &&
      "headlineLevel" in node &&
      node.headlineLevel === 1 &&
      (("style" in node && node.style === "section") ||
        ("fontSize" in node && node.fontSize === 12));
    const key = sectionHeading
      ? Object.keys(labels).find((key) => labels[key] === title)
      : undefined;
    if (key) {
      current = [];
      sections.set(key, current);
    }
    current.push(node);
  }
  definition.content = [...header, ...order.flatMap((key) => sections.get(key) ?? [])];
}

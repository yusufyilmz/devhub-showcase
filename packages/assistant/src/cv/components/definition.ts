import Handlebars from "handlebars";
import type { TDocumentDefinitions } from "pdfmake/interfaces";

import type { PortfolioProfile } from "@shared/config";

import { atsContent } from "./ats-content";
import { createCvData } from "./data";

/** Shared with Plop so JSON escaping is identical in CLI and website output. */
export const cvHelpers = {
  json: (value: unknown) => JSON.stringify(value ?? ""),
};

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
  const definition: TDocumentDefinitions = profile.cvLayout?.startsWith("ats")
    ? {
        content: atsContent(data),
        defaultStyle: { font: "Roboto", fontSize: data.cvFontSize, lineHeight: data.cvLineHeight },
        pageMargins: data.cvPageMargins as [number, number, number, number],
        pageSize: data.cvPageSize,
      }
    : (JSON.parse(json) as TDocumentDefinitions);
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

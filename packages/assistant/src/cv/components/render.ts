import pdfmake from "pdfmake";
import fonts from "pdfmake/build/vfs_fonts.js";

import type { PortfolioProfile } from "@shared/config";

import { createCvData } from "./data";
import { createCvDefinition } from "./definition";
import { orderCvContent } from "./section-order";

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

export async function renderCv(
  profile: PortfolioProfile,
  template: string,
  render?: Parameters<typeof createCvDefinition>[2],
  order?: string[],
): Promise<Buffer> {
  const definition = createCvDefinition(profile, template, render);
  orderCvContent(definition, createCvData(profile), order);
  return pdfmake.createPdf(definition).getBuffer();
}

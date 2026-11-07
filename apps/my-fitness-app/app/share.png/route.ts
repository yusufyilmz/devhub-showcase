import { createShareImage } from "@shared/ui/seo/image";

import { fitnessSeo } from "../../features/seo";

export function GET() {
  return createShareImage({
    accent: "#34d399",
    brand: fitnessSeo.title,
    initials: "F",
    subtitle: fitnessSeo.description,
    title: "Plan your day. Build your routine.",
    url: new URL(fitnessSeo.canonical).host,
  });
}

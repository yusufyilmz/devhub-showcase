import { createPageMetadata } from "@shared/ui/seo";

import { fitnessSeo } from "@/services/site/seo";
import { FitnessApp } from "@/views/fitness/fitness-app";

const title = "My Fitness Studio demo";
export const metadata = createPageMetadata({
  canonical: fitnessSeo.previewUrl,
  description: "Explore the My Fitness Studio demo with a sample daily fitness plan.",
  image: { alt: fitnessSeo.title, url: fitnessSeo.image },
  robots: { follow: true, index: true },
  siteName: fitnessSeo.title,
  title,
});
export default function PreviewPage() {
  return <FitnessApp demo />;
}

import { createPageMetadata } from "@shared/ui/seo";

import { FitnessApp } from "@/features/fitness/fitness-app";
import { fitnessSeo } from "@/features/seo";

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

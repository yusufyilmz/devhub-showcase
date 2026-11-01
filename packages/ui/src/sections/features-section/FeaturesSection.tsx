import { SectionPresentation } from "../presenter";
import type { SectionProps } from "../types";

export function FeaturesSection(props: SectionProps) {
  return <SectionPresentation {...props} type="features" />;
}

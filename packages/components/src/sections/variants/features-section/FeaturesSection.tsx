import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function FeaturesSection(props: SectionProps) {
  return <SectionPresentation {...props} type="features" />;
}

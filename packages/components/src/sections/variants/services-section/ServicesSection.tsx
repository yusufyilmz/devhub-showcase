import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function ServicesSection(props: SectionProps) {
  return <SectionPresentation {...props} type="services" />;
}

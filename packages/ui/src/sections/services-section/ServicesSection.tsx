import { SectionPresentation } from "../presenter";
import type { SectionProps } from "../types";

export function ServicesSection(props: SectionProps) {
  return <SectionPresentation {...props} type="services" />;
}

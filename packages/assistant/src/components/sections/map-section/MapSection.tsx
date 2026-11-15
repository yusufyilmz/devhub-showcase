import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function MapSection(props: SectionProps) {
  return <SectionPresentation {...props} type="map" />;
}

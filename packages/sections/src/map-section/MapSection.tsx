import { SectionPresentation } from "../shared/presenter";
import type { SectionProps } from "../types";
export function MapSection(props: SectionProps) {
  return <SectionPresentation {...props} type="map" />;
}

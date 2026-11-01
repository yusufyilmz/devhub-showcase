import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function MapSection(props: SectionProps) {
  return <SectionPresentation {...props} type="map" />;
}

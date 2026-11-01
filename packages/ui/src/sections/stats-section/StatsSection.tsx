import { SectionPresentation } from "../presenter";
import type { SectionProps } from "../types";

export function StatsSection(props: SectionProps) {
  return <SectionPresentation {...props} type="stats" />;
}

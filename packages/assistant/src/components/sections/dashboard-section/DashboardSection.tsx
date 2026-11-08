import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function DashboardSection(props: SectionProps) {
  return <SectionPresentation {...props} type="dashboard" />;
}

import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function ClientsSection(props: SectionProps) {
  return <SectionPresentation {...props} type="clients" />;
}

import { SectionPresentation } from "../presenter";
import type { SectionProps } from "../types";

export function ClientsSection(props: SectionProps) {
  return <SectionPresentation {...props} type="clients" />;
}

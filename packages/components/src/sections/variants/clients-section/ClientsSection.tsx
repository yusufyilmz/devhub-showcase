import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function ClientsSection(props: SectionProps) {
  return <SectionPresentation {...props} type="clients" />;
}

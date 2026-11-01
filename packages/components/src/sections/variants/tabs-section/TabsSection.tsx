import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function TabsSection(props: SectionProps) {
  return <SectionPresentation {...props} type="tabs" />;
}

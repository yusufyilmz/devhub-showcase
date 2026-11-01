import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function CalendarLinkSection(props: SectionProps) {
  return <SectionPresentation {...props} type="calendar-link" />;
}

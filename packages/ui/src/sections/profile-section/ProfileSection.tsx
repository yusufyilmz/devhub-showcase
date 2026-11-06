import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function ProfileSection(props: SectionProps) {
  return <SectionPresentation {...props} type="profile" />;
}

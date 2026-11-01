import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function ProfileSection(props: SectionProps) {
  return <SectionPresentation {...props} type="profile" />;
}

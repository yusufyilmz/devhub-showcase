import { SpecialView } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function TableOfContents(props: SectionProps) {
  return <SpecialView {...props} type="table-of-contents" />;
}

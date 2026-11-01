import { SectionPresentation } from "../presenter";
import type { SectionProps } from "../types";

export function TestimonialsSection(props: SectionProps) {
  return <SectionPresentation {...props} type="testimonials" />;
}

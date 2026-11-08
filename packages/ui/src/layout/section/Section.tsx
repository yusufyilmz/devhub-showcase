import "../portfolio/portfolio.css";

import { Slot } from "@radix-ui/react-slot";

import { sectionClassName, sectionStyles } from "./styles";
import type { SectionSurfaceProps } from "./types";

export function Section({
  children,
  sectionId,
  title,
  subtitle,
  className = "",
  eyebrow,
  asChild = false,
}: SectionSurfaceProps) {
  if (asChild) return <Slot className={className}>{children}</Slot>;
  return (
    <section className={sectionClassName(className)} id={sectionId}>
      <div className={sectionStyles.element1}>
        <p className={sectionStyles.element2}>{eyebrow ?? sectionId?.replaceAll("-", " ")}</p>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <div className={sectionStyles.element3}>{children}</div>
    </section>
  );
}

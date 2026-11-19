import "../../styles/portfolio/portfolio.css";

import { Slot } from "@radix-ui/react-slot";

import { SectionFrame } from "./section-frame";
import { SectionHeading } from "./section-heading";
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
  const label = eyebrow ?? sectionId?.replaceAll("-", " ");
  return (
    <SectionFrame
      className={sectionClassName(className)}
      context="standalone"
      heading={
        <SectionHeading
          className={sectionStyles.element1}
          description={subtitle}
          eyebrow={label}
          id={sectionId ? `${sectionId}-heading` : "section-heading"}
          level={2}
          title={title ?? ""}
        />
      }
      id={sectionId}
      surface="plain"
      width="contained"
    >
      {children}
    </SectionFrame>
  );
}

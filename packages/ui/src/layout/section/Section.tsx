import type { PropsWithChildren } from "react";

import { Slot } from "@radix-ui/react-slot";

export function Section({
  children,
  sectionId,
  title,
  subtitle,
  className = "",
  eyebrow,
  asChild = false,
}: PropsWithChildren<{
  sectionId?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  eyebrow?: string;
  asChild?: boolean;
}>) {
  if (asChild) return <Slot className={className}>{children}</Slot>;
  return (
    <section className={`portfolio-section ${className}`} id={sectionId}>
      <div className="section-heading">
        <p className="eyebrow">{eyebrow ?? sectionId?.replaceAll("-", " ")}</p>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <div className="section-content">{children}</div>
    </section>
  );
}

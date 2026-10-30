import type { PropsWithChildren } from "react";
export function Section({
  children,
  sectionId,
  title,
  subtitle,
  className = "",
  eyebrow,
}: PropsWithChildren<{
  sectionId: string;
  title: string;
  subtitle: string;
  className?: string;
  eyebrow?: string;
}>) {
  return (
    <section className={`portfolio-section ${className}`} id={sectionId}>
      <div className="section-heading">
        <p className="eyebrow">{eyebrow ?? sectionId.replaceAll("-", " ")}</p>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <div className="section-content">{children}</div>
    </section>
  );
}

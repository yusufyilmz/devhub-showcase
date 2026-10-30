import type { ReactNode } from "react";
export function StudioShell({
  children,
  brand,
  title,
  homeHref = "/",
  contentId = "studio-content",
  tools,
}: {
  children: ReactNode;
  brand: ReactNode;
  title: string;
  homeHref?: string;
  contentId?: string;
  tools?: ReactNode;
}) {
  return (
    <div className="admin-shell">
      <a className="skip-link" href={`#${contentId}`}>
        Skip to content
      </a>
      <header className="admin-brand">
        <a className="brand-mark" href={homeHref}>
          {brand}
        </a>
        <span>{title}</span>
        {tools}
      </header>
      {children}
    </div>
  );
}

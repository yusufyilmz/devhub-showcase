import type { ReactNode } from "react";

import { Card } from "../../cards";

export function StudioHeading({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Card asChild layout="plain" withAccent withHover={false}>
      <header className="studio-editor-header">
        <div className="studio-heading">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          {actions && <div className="studio-header-actions">{actions}</div>}
        </div>

        {children}
      </header>
    </Card>
  );
}

import { Card } from "../../cards";
import type { SectionItem } from "../section/types";

export function StepList({ items }: { items: SectionItem[] }) {
  if (!items.length) return null;
  return (
    <ol className="@container m-0 grid list-none gap-s p-0">
      {items.map((item, index) => (
        <Card asChild key={item.id} layout="plain" surface="portfolio">
          <li className="grid min-w-0 gap-sm p-md @xs:grid-cols-[auto_minmax(0,1fr)]">
            <span
              aria-hidden="true"
              className="grid size-9 place-items-center rounded-full border border-border/75 bg-muted/35 text-sm font-semibold text-foreground"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <h3>{item.title}</h3>
              {item.content}
            </div>
          </li>
        </Card>
      ))}
    </ol>
  );
}

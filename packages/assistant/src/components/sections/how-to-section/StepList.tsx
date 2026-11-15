import { Card } from "@shared/ui/cards";
import type { SectionItem } from "@shared/ui/section";

export function StepList({ items }: { items: SectionItem[] }) {
  if (!items.length) return null;
  return (
    <ol className="m-0 grid list-none gap-s p-0">
      {items.map((item, index) => (
        <Card asChild key={item.id} layout="plain" surface="portfolio">
          <li className="grid grid-cols-[auto_minmax(0,1fr)] gap-sm p-md">
            <span
              aria-hidden="true"
              className="grid size-9 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
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

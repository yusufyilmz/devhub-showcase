import { Card } from "../../cards";
import type { SectionItem } from "../../layout/section";

export function StepList({ items, landing = false }: { items: SectionItem[]; landing?: boolean }) {
  if (!items.length) return null;
  return (
    <ol className={landing ? "home-steps" : "m-0 grid list-none gap-s p-0"}>
      {items.map((item, index) => (
        <Card
          asChild
          interaction={landing ? "lift" : "static"}
          key={item.id}
          layout="plain"
          surface="portfolio"
        >
          <li className={landing ? undefined : "grid grid-cols-[auto_minmax(0,1fr)] gap-sm p-md"}>
            <span
              aria-hidden="true"
              className={
                landing
                  ? undefined
                  : "grid size-9 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
              }
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            {landing ? (
              <>
                <h3>{item.title}</h3>
                {item.content}
              </>
            ) : (
              <div className="min-w-0">
                <h3>{item.title}</h3>
                {item.content}
              </div>
            )}
          </li>
        </Card>
      ))}
    </ol>
  );
}

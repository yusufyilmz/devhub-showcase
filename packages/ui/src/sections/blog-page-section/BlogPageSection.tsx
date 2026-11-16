import { Card } from "../../cards";
import { ItemContent } from "../collection-view/CollectionView";
import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function BlogPageSection(props: SectionProps) {
  const { section, language } = props;
  if (section.options?.layout !== "blog-featured") {
    return <SectionPresentation {...props} type="blog-page" />;
  }
  if (!section.visible || (!section.items.length && !section.options.description)) return null;

  const [featured, ...posts] = section.items;
  const headingId = `${section.id}-heading`;
  return (
    <section
      aria-labelledby={headingId}
      className="@container scroll-mt-24 grid min-w-0 gap-lg py-xl"
      data-section-layout="blog-featured"
      data-section-type="blog-page"
      id={section.id}
    >
      <header className="grid min-w-0 gap-s">
        <h2
          className="text-balance text-3xl font-semibold tracking-tight @lg:text-4xl"
          id={headingId}
        >
          {section.title}
        </h2>
        {section.options.description && (
          <p className="max-w-prose leading-relaxed text-muted-foreground">
            {section.options.description}
          </p>
        )}
      </header>
      <div className="grid min-w-0 items-start gap-lg @3xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        {featured && (
          <Card
            asChild
            className="grid min-w-0 content-start gap-md border-border/70 p-md @lg:p-lg"
            interaction="static"
            layout="plain"
          >
            <article className="wrap-anywhere">
              <h3 className="text-balance text-2xl font-semibold tracking-tight">
                {featured.title}
              </h3>
              <div className="grid min-w-0 gap-s leading-relaxed text-muted-foreground">
                <ItemContent item={featured} language={language} />
              </div>
            </article>
          </Card>
        )}
        {posts.length > 0 && (
          <ol className="m-0 min-w-0 list-none divide-y divide-border/70 border-y border-border/70 p-0">
            {posts.map((item) => (
              <li
                className="grid min-w-0 gap-xs py-md text-sm leading-relaxed text-muted-foreground wrap-anywhere [&_.work-media]:max-w-[12rem]"
                key={item.id}
              >
                <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                <ItemContent item={item} language={language} />
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}

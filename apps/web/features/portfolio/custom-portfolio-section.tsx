import {
  SectionAccordion,
  SectionCarousel,
  SectionGrid,
  type SectionItem,
  SectionTabs
} from '@shared/components/section-views'
import type { CustomSection } from '@shared/content'

export function CustomPortfolioSection({
  section
}: {
  section: CustomSection
}) {
  if (!section.visible || !section.items.length) return null
  const items: SectionItem[] = section.items.map((item) => ({
    id: item.id,
    title: item.title,
    content: (
      <>
        {item.body
          .split(/\n\s*\n/)
          .filter(Boolean)
          .map((paragraph, index) => (
            <p key={`${item.id}-${index}`} style={{ whiteSpace: 'pre-line' }}>
              {paragraph}
            </p>
          ))}
        {/^https?:\/\//i.test(item.url) && (
          <a href={item.url}>{item.title} ↗</a>
        )}
      </>
    )
  }))
  const props = { items, label: section.title }
  return (
    <section
      id={section.id}
      className="folio-section configured-section"
      aria-labelledby={`${section.id}-heading`}
    >
      <h2 id={`${section.id}-heading`}>{section.title}</h2>
      <CustomView renderer={section.renderer} {...props} />
    </section>
  )
}
function CustomView({
  renderer,
  items,
  label
}: {
  renderer: CustomSection['renderer']
  items: SectionItem[]
  label: string
}) {
  switch (renderer) {
    case 'cards':
      return <SectionGrid items={items} label={label} />
    case 'accordion':
      return <SectionAccordion items={items} label={label} />
    case 'tabs':
      return <SectionTabs items={items} label={label} />
    case 'carousel':
      return <SectionCarousel items={items} label={label} />
    case 'list':
      return (
        <div>
          {items.map((item) => (
            <article key={item.id}>
              <h3>{item.title}</h3>
              {item.content}
            </article>
          ))}
        </div>
      )
  }
}

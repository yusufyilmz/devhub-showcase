import {
  SectionAccordion,
  SectionCarousel,
  SectionGrid,
  type SectionItem,
  SectionTabs
} from '@shared/components/section-views'
import { WorkMedia } from '@shared/components/work-media'
import {
  type CustomSection,
  getPortfolioCopy,
  getSocialWork,
  type Language
} from '@shared/content'

export function CustomPortfolioSection({
  section,
  language
}: {
  section: CustomSection
  language?: Language
}) {
  if (!section.visible || !section.items.length) return null
  const text = getPortfolioCopy(language)
  const items: SectionItem[] = section.items.map((item) => ({
    id: item.id,
    title: item.title,
    content: (
      <>
        <WorkMedia
          loadLabel={text.loadVideo}
          unloadLabel={text.unloadVideo}
          title={item.title}
          imageUrl={item.imageUrl}
          youtubeId={
            section.composition === 'youtube'
              ? getSocialWork(item.url)?.id
              : undefined
          }
        />
        {item.body
          .split(/\n\s*\n/)
          .filter(Boolean)
          .map((paragraph, index) => (
            <p
              key={`${item.id}-${index}`}
              className={
                section.composition === 'testimonials'
                  ? 'testimonial-quote'
                  : undefined
              }
              style={{ whiteSpace: 'pre-line' }}
            >
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
      className={`folio-section configured-section composition-${section.composition ?? 'custom'}`}
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

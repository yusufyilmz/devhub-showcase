import type { PropsWithChildren } from 'react'
export function Section({
  children,
  sectionId,
  title,
  subtitle,
  className = ''
}: PropsWithChildren<{
  sectionId: string
  title: string
  subtitle: string
  className?: string
}>) {
  return (
    <section id={sectionId} className={`portfolio-section ${className}`}>
      <div className="section-heading">
        <p className="eyebrow">{sectionId.replaceAll('-', ' ')}</p>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <div className="section-content">{children}</div>
    </section>
  )
}

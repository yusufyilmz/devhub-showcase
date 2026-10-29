import { getPortfolioCopy, type Language } from '@shared/content'
import { Button } from '../../../components'

export function MenuItems({ language = 'en' }: { language?: Language }) {
  const text = getPortfolioCopy(language)
  const items = [
    ['#about-me', text.about],
    ['#experiences', text.navExperience],
    ['#projects', text.navProjects],
    ['#skills', text.skills],
    ['#educations', text.navEducation],
    ['#referrals', text.navTestimonials]
  ]
  return (
    <>
      {items.map(([id, title]) => (
        <Button
          aria-label={title}
          key={id}
          variant="text"
          className="text-main-white border-none whitespace-pre"
          href={id}
        >
          {title}
        </Button>
      ))}
    </>
  )
}

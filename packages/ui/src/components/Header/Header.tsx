import { ProjectButton } from '../buttons/ProjectButton'
import { siteCopy } from '@shared/content'

export const Header: React.FC = () => {
  return (
    <header className="text-center py-12">
      <h1 className="text-5xl font-bold text-main-white mb-6">
        {siteCopy.header.title}
      </h1>
      <p className="text-lg text-main-gray mb-10">
        {siteCopy.header.description}
      </p>
      <ProjectButton title={siteCopy.header.buttonText} />
    </header>
  )
}

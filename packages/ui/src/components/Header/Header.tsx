import { ProjectButton } from '../buttons/ProjectButton'

export const Header: React.FC = () => {
  return (
    <header className="text-center py-12">
      <h1 className="text-5xl font-bold text-main-white mb-6">
        Welcome to Yusuf’s DevHub
      </h1>
      <p className="text-lg text-main-gray mb-10">
        Showcase of my work, CV, and AI-powered chat.
      </p>
      <ProjectButton title="View Project" />
    </header>
  )
}

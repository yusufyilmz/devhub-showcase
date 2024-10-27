import { Navbar } from '../Navbar'

export const Header: React.FC = () => {
  return (
    <header className="sticky px-page-px-sm md:px-page-px bg-main-primary text-center top-0 h-16 z-50">
      <Navbar />
    </header>
  )
}

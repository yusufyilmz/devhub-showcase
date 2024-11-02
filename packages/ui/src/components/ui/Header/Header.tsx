import { Navbar } from '../Navbar'

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-main-primary border-none shadow-none">
      <Navbar />
    </header>
  )
}

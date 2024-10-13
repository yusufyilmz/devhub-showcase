import { Button } from '@mui/material'
import { copy } from '@shared/content'

export const Navbar: React.FC = () => {
  return (
    <nav className="p-4 shadow-lg bg-backgroundColor-primary">
      <div className="container mx-auto">
        <div className="space-x-4">
          <Button variant="text" color="secondary" href="#projects">
            {copy.navbar.projects}
          </Button>
          <Button variant="text" color="secondary" href="#cv">
            {copy.navbar.cv}
          </Button>
        </div>
      </div>
    </nav>
  )
}

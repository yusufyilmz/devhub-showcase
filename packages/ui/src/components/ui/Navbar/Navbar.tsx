import { Button } from '@mui/material'
import { siteCopy } from '@shared/content'

export const Navbar: React.FC = () => {
  return (
    <nav className="p-4 shadow-lg bg-backgroundColor-primary">
      <div className="container mx-auto">
        <div className="space-x-4">
          <Button variant="text" color="secondary" href="#projects">
            {siteCopy.navbar.projects}
          </Button>
          <Button variant="text" color="secondary" href="#cv">
            {siteCopy.navbar.cv}
          </Button>
          <Button variant="text" color="secondary" href="/projects">
            {siteCopy.navbar.chat}
          </Button>
        </div>
      </div>
    </nav>
  )
}

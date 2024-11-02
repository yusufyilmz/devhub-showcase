'use client'

import { useState } from 'react'
import { copy } from '@shared/content'
import { IconButton, Button, Drawer, MenuIcon } from '@shared/ui/components'
import { AboutSection } from '../../sections/about/AboutSection'

const MenuItems = () => (
  <>
    {Object.keys(copy.navbar).filter((x) => x !== 'summary').map(key => (
      <Button
        aria-label={copy.navbar[key]?.title}
        key={key}
        variant="text"
        className="text-main-white border-none whitespace-pre"
        href={copy.navbar[key]?.id}
      >
        {copy.navbar[key]?.title}
      </Button>
    ))}
  </>
)

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="flex justify-between md:justify-center items-center p-4 bg-transparent">
      <IconButton
        aria-label="Menu"
        onClick={toggleMenu}
        variant="text"
        className="hover:scale-105 text-main-lightest-slate transition-transform md:hidden"
      >
        <MenuIcon fontSize="large" />
      </IconButton>
      <AboutSection />
      <div className={`hidden md:block`}>
        <MenuItems />
      </div>
      <Drawer placement="right" open={isOpen} onClose={toggleMenu}>
        <div
          className="bg-main-dark h-full flex flex-col justify-start p-4 align-middle"
          role="presentation"
        >
          <MenuItems />
        </div>
      </Drawer>
    </nav>
  )
}

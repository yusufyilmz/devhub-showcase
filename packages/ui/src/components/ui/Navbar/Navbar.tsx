'use client'

import { Box, Button, Drawer, IconButton } from '@mui/material'
import { useState } from 'react'
import { copy } from '@shared/content'
import { AboutSection } from '../../sections/about/AboutSection'
import MenuIcon from '@mui/icons-material/Menu'

const MenuItems = () => (
  <>
    {Object.keys(copy.navbar).map(key => (
      <Button
        aria-label={copy.navbar[key]?.title}
        key={key}
        variant="text"
        className="text-main-white whitespace-pre"
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
    <nav className="container flex justify-between md:justify-center items-center p-4 bg-main-primary">
      <IconButton
        aria-label="Menu"
        onClick={toggleMenu}
        color="inherit"
        className="hover:scale-105 text-textColor-light transition-transform md:hidden"
      >
        <MenuIcon fontSize="large" />
      </IconButton>
      <AboutSection />
      <div className={`hidden md:block`}>
        <MenuItems />
      </div>
      <Drawer anchor="right" open={isOpen} onClose={toggleMenu}>
        <Box
          className="bg-main-dark h-full flex flex-col justify-start py-4 px-2 align-middle"
          role="presentation"
        >
          <MenuItems />
        </Box>
      </Drawer>
    </nav>
  )
}

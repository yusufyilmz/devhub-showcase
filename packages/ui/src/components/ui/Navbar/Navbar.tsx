'use client'

import { Box, Button, Drawer, IconButton } from '@mui/material'
import { useState } from 'react'
import { copy } from '@shared/content'
import { AboutSection } from '../../about/AboutSection'
import MenuIcon from '@mui/icons-material/Menu'

const MenuItems = () => (
  <>
    {Object.keys(copy.navbar).map(key => (
      <Button
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
    <nav className="p-4 bg-main-primary">
      <div className="container flex justify-between md:justify-center items-center">
        <IconButton
          onClick={toggleMenu}
          color="inherit"
          aria-label="open menu"
          className="hover:scale-105 text-textColor-light  transition-transform md:hidden"
        >
          <MenuIcon fontSize="large" />
        </IconButton>
        <AboutSection />
        <div className={`space-x-4 hidden md:block`}>
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
      </div>
    </nav>
  )
}

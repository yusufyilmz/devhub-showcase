'use client'

import { Box, Button, Drawer } from '@mui/material'
import { useState } from 'react'
import { copy } from '@shared/content'
import { AboutSection } from '../../about/AboutSection'


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
        <div className="md:hidden">
          <button
            className="text-gray-800 focus:outline-none"
            onClick={toggleMenu}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
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

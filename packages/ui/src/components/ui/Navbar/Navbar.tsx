'use client'

import { Box, Button, Drawer } from '@mui/material'
import { useState } from 'react'
import { copy } from '@shared/content'
import { AboutSection } from '../../about/AboutSection'

const MenuItems = () => (
  <>
    {' '}
    {Object.keys(copy.navbar).map(key => (
      <Button key={key} variant="text" color="secondary" href={`#${key}`}>
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
    <nav className="md:px-page-px p-4 shadow-lg bg-main-black text-main-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-semibold">{copy.header.logoTitle}</div>
        <div className="lg:hidden">
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
        <div className={`lg:flex space-x-4 hidden md:block`}>
          <MenuItems />
        </div>
        <Drawer anchor="right" open={isOpen} onClose={toggleMenu}>
          <Box
            className="bg-main-black h-full flex flex-col justify-start py-4 px-2 align-middle"
            role="presentation"
          >
            <MenuItems />
          </Box>
        </Drawer>
        <div className="hidden lg:flex items-center">
          <AboutSection />
        </div>
      </div>
    </nav>
  )
}

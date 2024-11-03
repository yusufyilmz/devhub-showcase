'use client'

import React, { useState } from 'react'
import { IconButton, Drawer, MenuIcon } from '../../../components'
import { MenuItems } from './MenuItems'

export const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <IconButton
        aria-label="Menu"
        onClick={toggleMenu}
        className="hover:scale-105 text-main-lightest-slate transition-transform md:hidden"
      >
        <MenuIcon fontSize="large" />
      </IconButton>
      <Drawer anchor="right" open={isOpen} onClose={toggleMenu}>
        <div
          className="bg-main-dark h-full flex flex-col justify-start p-4 align-middle"
          role="presentation"
        >
          <MenuItems />
        </div>
      </Drawer>
    </>
  )
}

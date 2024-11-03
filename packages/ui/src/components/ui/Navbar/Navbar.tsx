import React from 'react'
import { AboutSection } from '../../sections/about/AboutSection'
import { MenuItems } from './MenuItems'
import { MobileMenu } from './MobileMenu'

export const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-between md:justify-center items-center p-4 bg-transparent">
      <MobileMenu />
      <AboutSection />
      <div className={`hidden md:block`}>
        <MenuItems />
      </div>
    </nav>
  )
}

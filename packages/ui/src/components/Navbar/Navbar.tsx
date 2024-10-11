// 'use client'

import { Button } from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="p-4 shadow-lg bg-backgroundColor-primary">
      <div className="container mx-auto">
        <div className="space-x-4">
          <Button
            variant="text"
            className="text-textColor-light"
            href="#projects"
          >
            Projects
          </Button>
          <Button variant="text" className="text-textColor-light" href="#cv">
            CV
          </Button>
          <Button
            variant="text"
            className="text-textColor-light"
            href="/projects"
          >
            CHAT
          </Button>
        </div>

        {isOpen && (
          <div className="flex flex-col mt-4 space-y-4">
            <Link href="/" className="text-white text-xl hover:text-blue-400">
              Home
            </Link>
            <Link
              href="/projects"
              className="text-white text-xl hover:text-blue-400"
            >
              Projects
            </Link>
            <Link
              href="/about"
              className="text-white text-xl hover:text-blue-400"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-white text-xl hover:text-blue-400"
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

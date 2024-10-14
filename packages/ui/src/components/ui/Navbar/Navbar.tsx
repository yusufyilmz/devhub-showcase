'use client'

import { Button } from '@mui/material';
import { useState } from 'react';
import { copy } from '@shared/content';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="md:px-page-px p-4 shadow-lg bg-main-black text-main-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-semibold">{copy.header.pageHeaderTitle}</div>
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
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
        <div className={`lg:flex space-x-4 ${isOpen ? "block" : "hidden"} lg:block`}>
          <Button variant="text" color="secondary" href="#companies">
            {copy.navbar.companies}
          </Button>
          <Button variant="text" color="secondary" href="#education">
            {copy.navbar.education}
          </Button>
          <Button variant="text" color="secondary" href="#projects">
            {copy.navbar.projects}
          </Button>
          <Button variant="text" color="secondary" href="#referrals">
            {copy.navbar.referrals}
          </Button>
          <Button variant="text" color="secondary" href="#cv">
            {copy.navbar.cv}
          </Button>
        </div>
      </div>
    </nav>
  );
};
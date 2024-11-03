import React from 'react'

import { copy } from '@shared/content'

export const Footer: React.FC = () => {
  return (
    <footer className="text-main-white min-h-10 py-6 z-[50] sticky bg-transparent border-none shadow-none">
      <div className="max-w-6xl mx-auto text-center border-none shadow-none bg-transparent">
        <p className="text-sm text-main-gray">{copy.footer.copyright}</p>
      </div>
    </footer>
  )
}

import React from 'react'
import { copy } from '@shared/content'
import { Button } from '../../../components'

export const MenuItems: React.FC = () => {
  return (
    <>
      {Object.keys(copy.navbar)
        .filter(x => x !== 'summary')
        .map(key => (
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
}

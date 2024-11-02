'use client'

import { useState } from 'react'
import { copy } from '@shared/content'
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Typography,
  IconButton,
  InfoIcon,
  List,
  ListItem
} from '../../../../components'

export function AboutSection() {
  const [openPopover, setOpenPopover] = useState(false)

  const triggers = {
    onMouseEnter: () => setOpenPopover(true),
    onMouseLeave: () => setOpenPopover(false)
  }

  return (
    <Popover open={openPopover} handler={setOpenPopover}>
      <PopoverHandler {...triggers}>
        <IconButton
          aria-label="About project"
          variant="text"
          className={`icon-button`}
        >
          <InfoIcon />
        </IconButton>
      </PopoverHandler>
      <PopoverContent
        {...triggers}
        className="z-50 w-full md:max-w-[32rem] max-h-[90vh] overflow-y-auto m-2"
      >
        <div className="p-2">
          <Typography variant="h5" className="mb-2">
            {copy.aboutSection.title}
          </Typography>
          <Typography variant="paragraph" className="mb-4">
            {copy.aboutSection.description}
          </Typography>
          <List className="border-none shadow-none">
            {copy.aboutSection.technologies.map((tech, index) => (
              <ListItem key={index} className="py-0 my-4">
                <Typography variant="small">
                  <strong>{tech.name}:</strong> {tech.details}
                </Typography>
              </ListItem>
            ))}
          </List>
          <Typography variant="paragraph" className="mt-4">
            {copy.aboutSection.conclusion}
          </Typography>
        </div>
      </PopoverContent>
    </Popover>
  )
}

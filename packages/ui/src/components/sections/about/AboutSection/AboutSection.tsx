'use client'

import {
  Popover,
  Typography,
  IconButton,
  List,
  ListItem,
  InfoIcon
} from '@shared/ui/components'
import { useState } from 'react'
import { copy } from '@shared/content'

export const AboutSection = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'about-popover' : undefined

  return (
    <div className="-mt-1">
      <IconButton
        aria-label="About project"
        className="icon-button"
        color="primary"
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <InfoIcon />
      </IconButton>
      <Popover
        id={id}
        sx={{ pointerEvents: 'none' }}
        open={open}
        anchorEl={anchorEl}
        disableRestoreFocus
        disableAutoFocus
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <section id="about-development" className="max-w-[500px] p-8">
          <Typography variant="h5">{copy.aboutSection.title}</Typography>
          <Typography variant="body1">
            {copy.aboutSection.description}
          </Typography>
          <List className="p-1 border-none shadow-none">
            {copy.aboutSection.technologies.map((tech, index) => (
              <ListItem key={index} className="p-0 m-0">
                <Typography variant="body2">
                  <strong>{tech.name}:</strong> {tech.details}
                </Typography>
              </ListItem>
            ))}
          </List>
          <Typography variant="body1">
            {copy.aboutSection.conclusion}
          </Typography>
        </section>
      </Popover>
    </div>
  )
}

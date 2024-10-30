'use client'

import {
  Popover,
  Typography,
  IconButton,
  List,
  ListItem,
  Box
} from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import { useState } from 'react'
import { copy } from '@shared/content'
import CloseIcon from '@mui/icons-material/Close'

export const AboutSection = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'about-popover' : undefined

  return (
    <Box className="-mt-1">
      <IconButton
        aria-label="About project"
        className="icon-button"
        color="primary"
        onClick={handleClick}
      >
        <InfoIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <section id="about-development" className="max-w-[500px] p-4">
          <IconButton
            onClick={() => {
              handleClose()
            }}
            aria-label="Close"
            className="icon-button absolute top-2 right-2 text-gray-500 focus:outline-none"
          >
            <CloseIcon className="h-4 w-4" />
          </IconButton>

          <Typography variant="h5" gutterBottom>
            {copy.aboutSection.title}
          </Typography>
          <Typography variant="body1" paragraph>
            {copy.aboutSection.description}
          </Typography>

          <List>
            {copy.aboutSection.technologies.map((tech, index) => (
              <ListItem key={index}>
                <Typography variant="body2">
                  <strong>{tech.name}:</strong> {tech.details}
                </Typography>
              </ListItem>
            ))}
          </List>

          <Typography variant="body1" paragraph>
            {copy.aboutSection.conclusion}
          </Typography>
        </section>
      </Popover>
    </Box>
  )
}

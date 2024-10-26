'use client'

import { Popover, Typography, IconButton, List, ListItem, Box } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import { useState } from 'react'
import { copy } from '@shared/content'

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
    <Box className="fixed top-0 right-0 p-4 z-50">
      <IconButton color='primary' onClick={handleClick}>
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
        <section
          id="about-development"
          className='max-w-[500px] p-4'
        >
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

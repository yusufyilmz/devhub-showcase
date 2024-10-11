'use client'

import Typography from '@mui/material/Typography'

export const ProjectTitle = ({
  title,
  link
}: {
  title: string
  link: string
}) => (
  <Typography
    variant="h5"
    component="h3"
    align="left"
    className="font-semibold text-main-black mb-2 text-2xl hover:underline"
    onClick={() => window.open(link)}
  >
    {title}
  </Typography>
)

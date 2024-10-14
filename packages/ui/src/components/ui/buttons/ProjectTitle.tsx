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
    component={link ? 'a' : 'p'}
    align="left"
    className="font-semibold text-main-black text-2xl hover:underline"
    onClick={() => window.open(link)}
  >
    {title}
  </Typography>
)

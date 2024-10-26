import { Box, Typography, Container, Paper } from '@mui/material'

import { Section } from '../../ui/Section'

import { copy } from '@shared/content'

const { id, title, subtitle } = copy.header.sections.aboutMe

export const AboutMeSection: React.FC = () => {
  return (
    <Section className="mt-32" sectionId={id} title={title} subtitle={subtitle}>
      <Container
        maxWidth="md"
        className=" h-full py-12 flex justify-center items-center"
      >
        <Paper elevation={3} className="bg-main-dark p-8 rounded-2xl shadow-lg">
          <Box className="space-y-4 text-lg leading-relaxed  ">
            <Typography className="text-main-slate">
              In 2012, I took my first steps into software development, driven
              by a desire to create meaningful, user-centered applications.
              Since then, I've had the chance to build impactful software across
              industries, from telecom and IT giants to fast-paced startups and
              a digital product powerhouse.
            </Typography>
            <Typography className="text-main-slate">
              Today, my primary focus is on building seamless, high-quality web
              experiences. As a fullstack engineer, I thrive at the intersection
              of design and functionality, creating applications that are as
              enjoyable to use as they are robust behind the scenes. I’m
              especially proud of projects like my recent AI-driven success
              story generator, blending tech innovation with practical solutions
              for global teams.
            </Typography>
            <Typography className="text-main-slate">
              When I'm not coding, you'll find me exploring the latest tech
              trends, hitting the gym, or spending time with friends.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Section>
  )
}

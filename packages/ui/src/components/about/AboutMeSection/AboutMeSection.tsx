import { Box, Typography, Container, Paper, Button } from '@mui/material'

import { Section } from '../../ui/Section'

import { copy } from '@shared/content'
import { SocialLinks } from '../SocialLinks'
import { PictureAsPdf as PdfIcon } from '@mui/icons-material'

const { id, title, subtitle } = copy.header.sections.aboutMe

export const AboutMeSection: React.FC = () => {
  return (
    <Section sectionId={id} title={title} subtitle={subtitle}>
      <Container
        maxWidth="md"
        className="h-full flex md:pt-32 justify-start items-center flex-col"
      >
        <Paper
          elevation={3}
          className="bg-main-primary p-8 rounded-2xl shadow-lg"
        >
          <Box className="space-y-4 text-lg leading-relaxed  ">
            <Typography className="text-main-slate">
              In 2012, I took my first steps into software development, driven
              by a passion to create impactful, user-centered applications. Over
              the years, I’ve had the opportunity to build software across
              industries, including telecom, IT, and high-growth startups. My
              career has been marked by diverse projects that have deepened my
              expertise, from developing tools for telecom giants to leading
              initiatives at a digital product powerhouse.
            </Typography>
            <Typography className="text-main-slate">
              Today, my primary focus is on delivering high-performance,
              scalable, and high-quality web experiences. As a full-stack
              engineer, I thrive at the intersection of design and
              functionality, creating applications that are as enjoyable to use
              as they are robust behind the scenes. One of my recent projects,
              an AI-powered success story generator, exemplifies my commitment
              to innovation, combining AI and user-friendly interfaces to
              support global teams with practical, scalable solutions.
            </Typography>
            <Typography className="text-main-slate">
              This portfolio app is another project I’m incredibly proud of.
              Developed using the latest technologies like Next.js, React,
              TypeScript, and Tailwind CSS, it integrates interactive features
              powered by ChatGPT and NLP classification, providing a
              personalized AI-driven experience for visitors to learn more about
              my work and skills. Every detail in this app reflects the
              knowledge and experience I’ve gained, from seamless UI design to
              efficient backend solutions. It stands as a testament to my
              commitment to building applications that bring real value to
              users.
            </Typography>
            <Typography className="text-main-slate">
              Outside of work, I’m always exploring the latest tech trends,
              hitting the gym, or spending time with friends, ready to take on
              new challenges and ideas.{' '}
            </Typography>
            <Box className="flex justify-center">
              <Button
                variant="text"
                href="/cv.pdf"
                target="_blank"
                endIcon={<PdfIcon />}
                rel="noopener noreferrer"
                className="whitespace-pre-wrap chip-shine-effect flex items-center text-white px-6 py-3 rounded-lg shadow transition"
              >
                View my Resume
              </Button>
            </Box>
          </Box>
        </Paper>
        <SocialLinks />
      </Container>
    </Section>
  )
}

import { copy, profile } from '@shared/content'
import type React from 'react'
import { Button, PdfIcon, Section, Typography } from '../../../../components'
import { SocialLinks } from '../SocialLinks'

const { id, title, subtitle } = copy.header.sections.aboutMe

export const AboutMeSection: React.FC = () => {
  return (
    <Section sectionId={id} title={title} subtitle={subtitle}>
      <div className="h-full flex md:pt-32 justify-start items-center flex-col px-8 md:px-0">
        <div className="space-y-4 text-lg">
          {profile.about.map((paragraph) => (
            <Typography key={paragraph} className="text-main-slate">
              {paragraph}
            </Typography>
          ))}
          <div className="flex justify-center">
            <Button
              aria-label="View my Resume"
              variant="text"
              href="/cv.pdf"
              target="_blank"
              endIcon={<PdfIcon />}
              rel="noopener noreferrer"
              className="whitespace-pre-wrap shine-effect flex items-center text-white px-6 py-3 rounded-lg shadow transition"
            >
              View my Resume
            </Button>
          </div>
        </div>
        <SocialLinks />
      </div>
    </Section>
  )
}

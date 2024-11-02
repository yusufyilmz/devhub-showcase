import { Typography, Button, Section, PdfIcon } from '@shared/ui/components'
import { copy } from '@shared/content'
import { SocialLinks } from '../SocialLinks'

const { id, title, subtitle } = copy.header.sections.aboutMe

export const AboutMeSection: React.FC = () => {
  return (
    <Section sectionId={id} title={title} subtitle={subtitle}>
      <div className="h-full flex md:pt-32 justify-start items-center flex-col px-8 md:px-0">
        <div className="space-y-4 text-lg">
          <Typography className="text-main-slate">
            In 2012, I started my journey in software development, driven by a
            passion for building practical, user-focused applications. Over the
            years, I’ve worked across industries like telecom, IT, and startups,
            tackling real-world challenges. One highlight was at Turkcell, where
            I developed a React-based WebChat app and multichannel chat gateway
            that handled over 600,000 customer interactions daily. That
            experience taught me a lot about creating scalable, reliable systems
            that perform well under high traffic.
          </Typography>
          <Typography className="text-main-slate">
            I’ve also created tools for automating Google Ads management, a
            Slack messaging system for cross-team communication, and an ETL
            composer for processing SEM alerts data in BigQuery when i work at
            Toptal. More recently, I worked on an AI-powered success story
            generator that personalizes talent stories, combining AI with a
            user-friendly interface to make content creation faster and more
            impactful. These projects reflect my focus on efficiency,
            scalability, and finding solutions that fit real needs.
          </Typography>
          <Typography className="text-main-slate">
            This portfolio app is something I’m proud to share. It showcases my
            work using Next.js, React, Node.js, TypeScript, and Tailwind CSS,
            along with NLP-based classification to enhance the ChatGPT-powered
            bot, making it more responsive in answering questions about my
            skills and experience. You can explore my projects, learn about my
            background, and even leave a referral or feedback through the app’s
            referral bot. Every part of this app, from the UI to the backend,
            represents my hands-on approach and dedication to building
            practical, well-rounded applications.
          </Typography>
          <Typography className="text-main-slate">
            Outside of work, I’m always exploring the latest tech trends,
            hitting the gym, or spending time with friends, ready to take on new
            challenges and ideas.{' '}
          </Typography>
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

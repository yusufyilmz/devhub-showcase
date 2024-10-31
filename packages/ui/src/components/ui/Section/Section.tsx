import { Box, Divider } from '@mui/material'
import React, { PropsWithChildren } from 'react'
import { PageHeader } from '../PageHeader'

type SectionProps = {
  sectionId: string
  title: string
  subtitle: string
  className?: string
}

export const Section: React.FC<PropsWithChildren<SectionProps>> = ({
  children,
  sectionId,
  title,
  subtitle,
  className
}) => {
  return (
    <>
      <Divider className="border-main-slate" sx={{ borderWidth: '0.01rem' }} />
      <section
        id={sectionId}
        className={`${className} mb-16 relative opacity-0 translate-y-8 transition-all duration-700 animate-fade-in-on-scroll parallax w-full flex flex-col items-center justify-start overflow-hidden md:overflow-visible `}
      >
        <Box className="flex flex-col gap-12 h-full md:flex-row w-full px-4 md:min-h-[calc(100vh-4rem)]">
          <Box className="sticky md:my-96 top-24 md:top-[calc(50vh)] md:h-full flex flex-col items-center justify-start md:justify-center w-[100vw] md:w-[30vw] text-center max-w-[90vw]">
            <PageHeader title={title} subtitle={subtitle} />
          </Box>
          <Box className="overflow-y-auto h-full mt-16  w-[100vw] md:w-[50vw] pl-1 md:pl-4 flex">
            {children}
          </Box>
        </Box>
      </section>
    </>
  )
}

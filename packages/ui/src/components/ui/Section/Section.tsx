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
      <Divider
        className="border-main-slate"
        sx={{ borderWidth: '0.01rem', mt: 32 }}
      />
      <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-[#010D1A] to-[#233554] opacity-70 blur-[2px]"></div>

      <section
        id={sectionId}
        className={`${className} h-section relative w-full flex flex-col items-center justify-start overflow-hidden `}
      >
        <Box className="flex flex-col h-full md:flex-row w-full px-4">
          <Box className="sticky top-24 h-full flex flex-col justify-start md:justify-center w-[100vw] md:w-[30vw] bg-main-primary text-center">
            <PageHeader title={title} subtitle={subtitle} />
          </Box>
          <Box className="overflow-y-auto h-full w-[100vw] md:w-[50vw] pl-4 flex">
         {children}
          </Box>
        </Box>
      </section>
    </>
  )
}

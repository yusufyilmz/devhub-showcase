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
      <section
        id={sectionId}
        className={`${className} h-section relative w-full flex flex-col items-center justify-start overflow-hidden `}
      >
        <Box className="flex flex-col gap-12 h-full md:flex-row w-full px-4">
          <Box className="sticky top-24 md:h-full flex flex-col items-center justify-start md:justify-center w-[100vw] md:w-[30vw] bg-main-primary text-center max-w-[90vw]">
            <PageHeader title={title} subtitle={subtitle} />
          </Box>
          <Box className="overflow-y-auto h-full w-[100vw] md:w-[50vw] pl-1 md:pl-4 flex mt-20">
            {children}
          </Box>
        </Box>
      </section>
    </>
  )
}

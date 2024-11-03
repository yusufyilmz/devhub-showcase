import React from 'react'
import { copy } from '@shared/content'

export const SummarySection: React.FC = () => {
  return (
    <section
      className="w-full flex h-section flex-col items-center justify-between px-0 text-center py-4 fade -mt-16"
      id="summary"
    >
      <div className="flex flex-col justify-center align-middle h-full">
        <h1 className="text-6xl text-main-white mb-6">
          {copy.header.main.title}
        </h1>
        <h2 className="text-3xl text-main-white mb-10">
          {copy.header.main.subTitle}
        </h2>
      </div>
    </section>
  )
}

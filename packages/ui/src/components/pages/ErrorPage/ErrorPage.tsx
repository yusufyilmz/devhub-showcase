import React from 'react'
import { copy } from '@shared/content'
import { GoBackButton, HomeButton, Typography } from '../../../components'

export const ErrorPage = () => {
  return (
    <div className="bg-main-primary flex flex-col gap-4 justify-center items-center w-p h-[calc(100vh-4rem)]">
      <Typography variant="h4" className="text-main-white">
        {copy.errorPage.title}
      </Typography>
      <Typography variant="body1" className="text-main-light-slate">
        {copy.errorPage.message}
      </Typography>
      <div className="flex gap-4 mb-4">
        <GoBackButton />
        <HomeButton />
      </div>
    </div>
  )
}

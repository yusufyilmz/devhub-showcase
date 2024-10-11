import { Typography } from '@mui/material'
import { siteCopy } from '@shared/content'
import { GoBackButton } from '../buttons/GoBackButton'
import { HomeButton } from '../buttons/HomeButton'

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col gap-4 justify-center items-center w-p h-[calc(100vh-540px)]">
      <Typography variant="h4" color="primary">
        {siteCopy.notFoundPage.title}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        {siteCopy.notFoundPage.message}
      </Typography>

      <div className="flex gap-4 mb-4">
        <GoBackButton />
        <HomeButton />
      </div>
    </div>
  )
}

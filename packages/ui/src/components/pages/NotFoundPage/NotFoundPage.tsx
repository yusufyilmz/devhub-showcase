import { Typography } from '@mui/material'
import { copy } from '@shared/content'
import { GoBackButton } from '../../ui/buttons/GoBackButton'
import { HomeButton } from '../../ui/buttons/HomeButton'

export const NotFoundPage = () => {
  return (
    <div className="bg-main-primary flex flex-col gap-4 justify-center items-center w-p h-[calc(100vh-4rem)]">
      <Typography variant="h4" color="primary">
        {copy.notFoundPage.title}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        {copy.notFoundPage.message}
      </Typography>
      <div className="flex gap-4 mb-4">
        <GoBackButton />
        <HomeButton />
      </div>
    </div>
  )
}

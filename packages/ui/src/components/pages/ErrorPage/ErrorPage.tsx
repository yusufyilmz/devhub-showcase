import { HomeButton } from '../../ui/buttons/HomeButton'
import { copy } from '@shared/content'
import { Typography } from '@mui/material'
import { GoBackButton } from '../../ui/buttons/GoBackButton'

export const ErrorPage = () => {
  return (
    <div className="flex flex-col gap-4 justify-center items-center w-p h-[calc(100vh-540px)]">
      <Typography variant="h4" color="primary">
        {copy.errorPage.title}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        {copy.errorPage.message}
      </Typography>
      <div className="flex gap-4 mb-4">
        <GoBackButton />
        <HomeButton />
      </div>
    </div>
  )
}

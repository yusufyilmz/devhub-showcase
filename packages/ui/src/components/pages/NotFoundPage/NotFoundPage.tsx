import { copy } from '@shared/content'
import { GoBackButton, HomeButton, Typography } from '@shared/ui/components'

export const NotFoundPage = () => {
  return (
    <div className="bg-main-primary flex flex-col gap-4 justify-center items-center w-p h-[calc(100vh-4rem)]">
      <Typography variant="h4" color="white">
        {copy.notFoundPage.title}
      </Typography>
      <Typography variant="paragraph" className="text-main-light-slate">
        {copy.notFoundPage.message}
      </Typography>
      <div className="flex gap-4 mb-4">
        <GoBackButton />
        <HomeButton />
      </div>
    </div>
  )
}

import type { Redirect } from 'next'
import { ReviewService } from '@shared/lib/services'
import type { ReviewWithReferrals } from '@shared/lib/types'
import { logger } from '@shared/lib/logger'
import { ReviewSection } from '@shared/ui/components'
import { handleSubmitReviewAction } from '../actions'

export const getPageResources = async (): Promise<
  | ReviewWithReferrals[]
  | {
      redirect: Redirect
    }
> => {
  try {
    const reviewService = new ReviewService(logger)
    const reviews = await reviewService.getPendingReviews()

    return reviews
  } catch (error) {
    logger.error(
      { message: (error as Error).message, stack: (error as Error).stack },
      'Error fetching reviews'
    )

    return {
      redirect: {
        destination: '/error',
        permanent: false
      }
    }
  }
}

export default async function ReviewsPage(): Promise<JSX.Element> {
  const pendingReviews = (await getPageResources()) as ReviewWithReferrals[]

  return (
    <main className="w-full h-[calc(100vh-8rem)] bg-main-primary  flex flex-col justify-center items-center">
      <ReviewSection
        handleReview={handleSubmitReviewAction}
        reviews={pendingReviews}
      />
    </main>
  )
}

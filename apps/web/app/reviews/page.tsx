import { logger } from '@shared/lib/logger'
import { ReviewService } from '@shared/lib/services'
import { createServerClient } from '@shared/lib/supabase'
import type { ReviewWithReferrals, SupabaseDbClient } from '@shared/lib/types'
import { ReviewSection } from '@shared/ui/components'
import type { Redirect } from 'next'
import { handleSubmitReviewAction } from '../actions'

export const getPageResources = async (supabase: SupabaseDbClient): Promise<
  | ReviewWithReferrals[]
  | {
    redirect: Redirect
  }
> => {
  try {
    const reviewService = new ReviewService(logger, supabase)
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
  const supabase = await createServerClient()
  const pendingReviews = (await getPageResources(supabase)) as ReviewWithReferrals[]

  return (
    <main className="w-full h-[calc(100vh-8rem)] bg-main-primary  flex flex-col justify-center items-center">
      <ReviewSection
        handleReview={handleSubmitReviewAction}
        reviews={pendingReviews}
      />
    </main>
  )
}

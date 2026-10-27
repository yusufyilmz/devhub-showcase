import type { Logger } from 'pino'
import { type DbClient, db } from '../../../../db'
import type { ResourceService } from '../../../../types'
import {
  ReviewState,
  type ReviewWithReferrals
} from '../../../../types/prisma/review'
import { ReviewWithReferralsArgs } from '../../../../types/prisma/review/prisma-args'

export class ReviewService implements ResourceService<ReviewWithReferrals> {
  constructor(
    _logger: Logger,
    private readonly dbClient: DbClient = db
  ) {}

  async getAll(): Promise<ReviewWithReferrals[]> {
    return this.dbClient.review.findMany(ReviewWithReferralsArgs)
  }

  async update(
    id: string,
    {
      state
    }: {
      state: ReviewState
    }
  ): Promise<ReviewWithReferrals> {
    return this.dbClient.review.update({
      where: {
        id
      },
      data: {
        state
      },
      ...ReviewWithReferralsArgs
    })
  }

  async getPendingReviews(): Promise<ReviewWithReferrals[]> {
    return this.dbClient.review.findMany({
      where: {
        state: ReviewState.PENDING
      },
      ...ReviewWithReferralsArgs
    })
  }
}

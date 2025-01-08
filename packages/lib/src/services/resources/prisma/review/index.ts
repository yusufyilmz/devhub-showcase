import { Logger } from 'pino'
import { db, DbClient } from '../../../../db'
import { ResourceService } from '../../../../types'
import { ReviewState, ReviewWithReferrals } from '../../../../types/prisma/review'
import { ReviewWithReferralsArgs } from '../../../../types/prisma/review/prisma-args'

export class ReviewService implements ResourceService<ReviewWithReferrals> {
  constructor(
    private logger: Logger,
    private readonly dbClient: DbClient = db
  ) { }

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

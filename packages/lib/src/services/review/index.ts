import { Logger } from 'pino'
import { db, DbClient } from '../../db'
import { ReviewState, ReviewWithReferrals } from '../../types/review'
import { ReviewWithReferralsArgs } from '../../types/review/prisma-args'

export class ReviewService {
  constructor(
    private logger: Logger,
    private readonly dbClient: DbClient = db
  ) {}

  async createReview(referralId: string): Promise<ReviewWithReferrals> {
    return this.dbClient.review.create({
      data: {
        state: ReviewState.PENDING,
        referral: {
          connect: {
            id: referralId
          }
        }
      },
      ...ReviewWithReferralsArgs
    })
  }

  async updateReview(
    id: string,
    state: ReviewState
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

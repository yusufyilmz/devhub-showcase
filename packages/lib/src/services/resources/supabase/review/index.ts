import { Logger } from 'pino';
import { ResourceService } from '../../../../types';
import { ReviewState, ReviewWithReferrals, SupabaseDbClient } from '../../../../types/supabase';
import { keysToCamelCase } from '../../../../utils/converter/camel-case';

export class ReviewService implements ResourceService<ReviewWithReferrals> {
  private logger: Logger;
  private readonly dbClient: SupabaseDbClient

  constructor(logger: Logger, dbClient: SupabaseDbClient) {
    this.logger = logger;
    this.dbClient = dbClient;
  }

  async getAll(): Promise<ReviewWithReferrals[]> {

    const { data, error } = await this.dbClient
      .from('reviews')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return keysToCamelCase<ReviewWithReferrals[]>(data);
  }

  async update(
    id: string,
    {
      state
    }: {
      state: ReviewState
    }
  ): Promise<ReviewWithReferrals> {

    const { data, error } = await this.dbClient
      .from('reviews')
      .update({
        state,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .single();

    if (error) {
      this.logger.error('Error updating review:', error);
      throw new Error(error.message);
    }

    return keysToCamelCase<ReviewWithReferrals>(data);
  }

  async getPendingReviews(): Promise<ReviewWithReferrals[]> {

    const { data, error } = await this.dbClient
      .from('reviews')
      .select('*')
      .eq('state', ReviewState.PENDING);

    if (error) {
      throw new Error(error.message);
    }

    return keysToCamelCase<ReviewWithReferrals[]>(data);
  }
}

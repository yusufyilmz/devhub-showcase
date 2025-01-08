import type { Logger } from 'pino';
import { ResourceService } from '../../../../types';
import { Referral, ReviewState, SupabaseDbClient } from '../../../../types/supabase';
import { keysToCamelCase } from '../../../../utils/converter/camel-case';
import { referralFormatter } from '../../../formatter';

export class ReferralService implements ResourceService<Referral> {
  private readonly dbClient: SupabaseDbClient
  private logger: Logger;

  constructor(logger: Logger, dbClient: SupabaseDbClient) {
    this.logger = logger;
    this.dbClient = dbClient;
  }

  async getAll(): Promise<Referral[]> {

    const { data, error } = await this.dbClient
      .from('referrals')
      .select(`
        *,
        review:reviews(state)
      `)

    if (error) {
      throw new Error(error.message);
    }

    const filteredReferrals = data.filter(referral => {
      const reviewState = referral.review?.[0]?.state;
      return reviewState === ReviewState.APPROVED || !reviewState;
    });

    return keysToCamelCase<Referral[]>(filteredReferrals);
  }

  async createGPTModal(): Promise<string> {

    const { data, error } = await this.dbClient

      .from('referrals')
      .select(`
        id,
        name,
        relationship,
        feedback,
        recommendation,
        contact_info,
        session_id,
        review (
          state
        )
      `);

    if (error) {
      throw new Error(error.message);
    }

    return referralFormatter(keysToCamelCase<Referral[]>(data));
  }

  saveReferral = async (
    category: string,
    answer: string,
    sessionId: string
  ): Promise<void> => {
    const logger = this.logger.child({ category, answer, sessionId });


    try {
      logger.debug('Saving referral answer');

      // Check if the referral exists
      const { data: existingReferral, error: fetchError } = await this.dbClient
        .from('referrals')
        .select('id')
        .eq('session_id', sessionId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (existingReferral) {
        // Update the existing referral
        const { error: updateError } = await this.dbClient
          .from('referrals')
          .update({
            [category]: answer,
            updated_at: new Date().toISOString()
          })
          .eq('session_id', sessionId);

        if (updateError) {
          throw updateError;
        }

        const { data: review, error: reviewError } = await this.dbClient
          .from('reviews')
          .select('state')
          .eq('referral_id', existingReferral.id)
          .single();

        if (reviewError) {
          throw reviewError;
        }

        if (!review) {

          const { error: createError } = await this.dbClient
            .from('reviews')
            .insert({
              id: crypto.randomUUID(),
              referral_id: existingReferral.id,
              state: ReviewState.PENDING,
              updated_at: new Date().toISOString()
            });

          if (createError) {
            throw createError;
          }
        } else if (review.state === ReviewState.REJECTED) {
          const { error: updateReviewError } = await this.dbClient
            .from('reviews')
            .update({ state: ReviewState.PENDING })
            .eq('referral_id', existingReferral.id);

          if (updateReviewError) {
            throw updateReviewError;
          }
        }

        logger.debug({ existingReferral }, 'Referral answer updated');
      } else {
        logger.warn('Referral not found for session_id:', sessionId);
      }
    } catch (error) {
      logger.error({ error }, 'Error saving referral answer');
    }
  }
}

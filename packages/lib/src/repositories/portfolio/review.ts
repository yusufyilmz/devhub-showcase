import { keysToCamelCase } from "@shared/utils";
import type { Logger } from "@shared/utils/logger";

import { ReviewState, type ReviewWithReferrals, type SupabaseDbClient } from "../../types/index";

export class ReviewService {
  private logger: Logger;
  private readonly dbClient: SupabaseDbClient;

  constructor(logger: Logger, dbClient: SupabaseDbClient) {
    this.logger = logger;
    this.dbClient = dbClient;
  }

  async getAll(): Promise<ReviewWithReferrals[]> {
    const { data, error } = await this.dbClient.from("reviews").select("*");

    if (error) {
      throw new Error(error.message);
    }

    return keysToCamelCase<ReviewWithReferrals[]>(data);
  }

  async update(
    id: string,
    { state, updatedAt }: { state: ReviewState; updatedAt: string },
  ): Promise<boolean> {
    const { data, error } = await this.dbClient
      .from("reviews")
      .update({
        state,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("state", ReviewState.PENDING)
      .eq("updated_at", updatedAt)
      .select("id")
      .maybeSingle();

    if (error) {
      this.logger.error({ error }, "Error updating review");
      throw new Error(error.message);
    }

    return Boolean(data);
  }

  async getPendingReviews(): Promise<ReviewWithReferrals[]> {
    const { data, error } = await this.dbClient
      .from("reviews")
      .select(`
      *,
      referral:referrals(*)
    `)
      .eq("state", ReviewState.PENDING)
      .order("created_at")
      .order("id");

    if (error) {
      throw new Error(error.message);
    }

    return keysToCamelCase<ReviewWithReferrals[]>(data);
  }
}

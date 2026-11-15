import type { Database, ResourceService } from "@shared/lib/types";
import { type Referral, ReviewState, type SupabaseDbClient } from "@shared/lib/types";
import { keysToCamelCase } from "@shared/lib/utils";
import type { Logger } from "@shared/utils/logger";

import { referralFormatter } from "../../../formatter";

// PostgREST can embed this relation as an object when it detects the unique foreign key.
function getReviewState(review: { state: string } | { state: string }[] | null) {
  return Array.isArray(review) ? review[0]?.state : review?.state;
}

export class ReferralService implements ResourceService<Referral> {
  private readonly dbClient: SupabaseDbClient;
  private logger: Logger;

  constructor(logger: Logger, dbClient: SupabaseDbClient) {
    this.logger = logger;
    this.dbClient = dbClient;
  }

  async getAll(): Promise<Referral[]> {
    const { data, error } = await this.dbClient.from("referrals").select(`
        *,
        review:reviews(state)
      `);

    if (error) {
      throw new Error(error.message);
    }

    const filteredReferrals = data.filter((referral) => {
      const reviewState = getReviewState(referral.review);
      return reviewState === ReviewState.APPROVED || !reviewState;
    });

    return keysToCamelCase<Referral[]>(filteredReferrals);
  }

  async createGPTModal(): Promise<string> {
    const { data, error } = await this.dbClient.from("referrals").select(`
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

  async saveReferral(category: string, answer: string, sessionId: string): Promise<void> {
    const field = category === "contactInfo" ? "contact_info" : category;
    if (!["name", "relationship", "feedback", "recommendation", "contact_info"].includes(field))
      throw new Error("Invalid referral field");

    const referral: Database["public"]["Tables"]["referrals"]["Insert"] = {
      session_id: sessionId,
      updated_at: new Date().toISOString(),
      [field]: answer,
    };
    const { error } = await this.dbClient
      .from("referrals")
      .upsert(referral, { defaultToNull: false, onConflict: "session_id" });
    if (error) {
      this.logger.error({ code: error.code }, "Error saving referral answer");
      throw new Error("Could not save referral");
    }
  }
}

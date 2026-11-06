import { redirect } from "next/navigation";

import { createServerClient } from "@shared/lib/supabase";
import type { ReviewWithReferrals, SupabaseDbClient } from "@shared/lib/types";
import { ReviewService } from "@shared/services/studio";
import { StudioHeading } from "@shared/ui/portfolio";
import { ReviewSection } from "@shared/ui/sections";
import { logger } from "@shared/utils/logger";

import { requireAdmin } from "@/features/admin/admin-auth";

import { handleSubmitReviewAction } from "../../actions";

const getPageResources = async (supabase: SupabaseDbClient): Promise<ReviewWithReferrals[]> => {
  try {
    const reviewService = new ReviewService(logger, supabase);
    const reviews = await reviewService.getPendingReviews();

    return reviews;
  } catch (error) {
    logger.error(
      { message: (error as Error).message, stack: (error as Error).stack },
      "Error fetching reviews",
    );

    return [];
  }
};

export default async function ReviewsPage(): Promise<React.JSX.Element> {
  try {
    await requireAdmin();
  } catch {
    redirect("/login");
  }
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const pendingReviews = configured ? await getPageResources(await createServerClient()) : [];
  return (
    <main className="studio" id="main-content">
      <StudioHeading
        description="Review referrals submitted for the portfolio."
        eyebrow="Portfolio moderation"
        title="Pending reviews"
      />
      {configured ? (
        <ReviewSection handleReview={handleSubmitReviewAction} reviews={pendingReviews} />
      ) : (
        <p className="editor-card">Reviews are not configured.</p>
      )}
    </main>
  );
}

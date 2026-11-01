import { redirect } from "next/navigation";

import { ReviewService } from "@shared/lib/services";
import { createServerClient } from "@shared/lib/supabase";
import type { ReviewWithReferrals, SupabaseDbClient } from "@shared/lib/types";
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
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL)
    return (
      <main>
        <p>Reviews are not configured.</p>
      </main>
    );
  const supabase = await createServerClient();
  const pendingReviews = await getPageResources(supabase);

  return (
    <main className="w-full h-[calc(100vh-8rem)] bg-main-primary  flex flex-col justify-center items-center">
      <ReviewSection handleReview={handleSubmitReviewAction} reviews={pendingReviews} />
    </main>
  );
}

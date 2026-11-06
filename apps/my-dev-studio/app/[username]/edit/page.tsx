import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { ReviewSection } from "@shared/ui/sections";

import { requireWorkspace } from "@/features/admin/admin-auth";
import { UserStorageSync } from "@/features/admin/user-storage-sync";
import { loadPendingPortfolioReviews } from "@/features/portfolio/portfolio-reviews";
import { ProfileEditor } from "@/features/studio";

import { submitPortfolioReviewAction } from "./review-actions";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Edit your CV",
};
export default async function EditCvPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams?: Promise<{ tab?: string | string[]; view?: string }>;
}) {
  const { username } = await params;
  const initiallyArranging = (await searchParams)?.view === "arrange";
  let workspace: Awaited<ReturnType<typeof requireWorkspace>>;
  try {
    workspace = await requireWorkspace();
  } catch {
    redirect("/login");
  }
  const snapshot = await workspace.repository.read();
  if (!snapshot || snapshot.username !== username) notFound();
  const canModerate = snapshot.id === "main";
  const openReviews = canModerate && (await searchParams)?.tab === "reviews";
  return (
    <>
      <UserStorageSync
        user={{
          id: workspace.user.id,
          name: snapshot.profile.name,
          ...(workspace.user.email ? { email: workspace.user.email } : {}),
        }}
      />
      <ProfileEditor
        initial={snapshot}
        initiallyArranging={initiallyArranging}
        initialTab={openReviews ? "Reviews" : "Profile"}
        reviews={
          canModerate ? (
            <ReviewSection
              handleReview={submitPortfolioReviewAction}
              reviews={await loadPendingPortfolioReviews(workspace.client)}
            />
          ) : undefined
        }
      />
    </>
  );
}

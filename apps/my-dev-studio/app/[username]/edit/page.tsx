import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { ReviewSection } from "@shared/ui/sections";

import { readWorkspaceSnapshot, requireWorkspace } from "@/services/admin/get-auth";
import { loadPendingPortfolioReviews } from "@/services/review/get-service";
import { StudioProfileEditor } from "@/views/studio/StudioProfileEditor";

import { submitPortfolioReviewAction } from "./actions";

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
  const query = await searchParams;
  const initiallyArranging = query?.view === "arrange";
  let workspace: Awaited<ReturnType<typeof requireWorkspace>>;
  try {
    workspace = await requireWorkspace();
  } catch {
    redirect("/login");
  }
  const snapshot = await readWorkspaceSnapshot();
  if (!snapshot || snapshot.username !== username) notFound();
  const canModerate = snapshot.id === "main";
  const openReviews = canModerate && query?.tab === "reviews";
  return (
    <StudioProfileEditor
      initial={snapshot}
      initiallyArranging={initiallyArranging}
      initialTab={openReviews ? "Reviews" : query?.tab === "sections" ? "Sections" : "Profile"}
      reviews={
        canModerate ? (
          <ReviewSection
            handleReview={submitPortfolioReviewAction}
            reviews={await loadPendingPortfolioReviews(workspace.client)}
          />
        ) : undefined
      }
      user={{
        id: workspace.user.id,
        name: snapshot.profile.name,
        ...(workspace.user.email ? { email: workspace.user.email } : {}),
      }}
    />
  );
}

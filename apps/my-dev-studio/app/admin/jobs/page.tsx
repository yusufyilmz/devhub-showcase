import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ProfileAccessError } from "@shared/lib/profile";
import { applicationStatuses } from "@shared/lib/services/jobs";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/cards";

import { requireWorkspace } from "@/features/admin/admin-auth";

import { loadJobs } from "../../api/jobs/_workspace";
import { JobsClient } from "./_client";

export const metadata: Metadata = { title: "Job Hunter" };
export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  try {
    const data = await loadJobs(await requireWorkspace());
    const { tab } = await searchParams;
    const initialTab =
      tab === "saved" ||
      tab === "applications" ||
      tab === "settings" ||
      (tab === "linkedin" && data.linkedInAlerts)
        ? tab
        : "discover";
    return <JobsClient initial={data} initialTab={initialTab} statuses={applicationStatuses} />;
  } catch (error) {
    if (error instanceof ProfileAccessError) redirect("/login");
    return (
      <Card>
        <CardHeader>
          <CardTitle>Job Hunter</CardTitle>
        </CardHeader>
        <CardContent>Job Hunter is unavailable. Try again shortly.</CardContent>
      </Card>
    );
  }
}

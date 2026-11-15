import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { applicationStatuses } from "@shared/services/jobs";
import { ProfileAccessError } from "@shared/services/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/cards";

import { requireWorkspace } from "@/features/admin/admin-auth";
import { JobsClient } from "@/features/jobs/jobs-client";
import { loadJobs } from "@/features/jobs/workspace";

export const metadata: Metadata = { title: "Job Hunter" };
export default async function JobsPage() {
  try {
    const data = await loadJobs(await requireWorkspace());
    return <JobsClient initial={data} statuses={applicationStatuses} />;
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

import { cvPath } from "@shared/lib/username";
import { redirect } from "next/navigation";

import { getPublicProfile } from "@/lib/public-profile";
export default async function LegacyPublicCvPage({ params }: { params: Promise<{ id: string }> }) {
  const snapshot = await getPublicProfile((await params).id);
  if (snapshot.username) redirect(cvPath(snapshot.username));
  redirect("/");
}

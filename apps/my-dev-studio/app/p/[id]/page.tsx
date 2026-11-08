import { redirect } from "next/navigation";

import { cvPath } from "@shared/lib/profiles";

import { getPublicProfile } from "../../[username]/_profile";

export default async function PublicCvRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const snapshot = await getPublicProfile((await params).id);
  if (snapshot.username) redirect(cvPath(snapshot.username));
  redirect("/");
}

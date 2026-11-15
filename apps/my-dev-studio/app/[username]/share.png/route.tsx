import { brandColor } from "@shared/assistant/portfolio-branding";
import { getNameInitials, urls } from "@shared/config";
import { createShareImage } from "@shared/ui/seo";

import { getUsernameProfile } from "../_profile";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  const { profile } = await getUsernameProfile(username, "/share.png");
  return createShareImage(
    {
      accent: brandColor(profile),
      brand: "MyDevStudio",
      initials: getNameInitials(profile.name),
      subtitle: profile.title,
      title: profile.name,
      url: urls.studio.portfolioUrl(username).replace(/^https?:\/\//, ""),
    },
    { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" },
  );
}

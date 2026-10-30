import { getNameInitials } from "@shared/content";
import { ImageResponse } from "next/og";

import { brandColor } from "../../../lib/portfolio-branding";
import { getUsernameProfile } from "../../../lib/public-profile";
import { portfolioUrl } from "../../../lib/site-url";
export const dynamic = "force-dynamic";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  const { profile } = await getUsernameProfile(username);
  const accent = brandColor(profile);
  return new ImageResponse(
    <div
      style={{
        background: "#111827",
        borderBottom: `12px solid ${accent}`,
        color: "#f9fafb",
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
        height: "100%",
        justifyContent: "space-between",
        padding: 64,
        width: "100%",
      }}
    >
      <div style={{ alignItems: "center", display: "flex", gap: 24 }}>
        <div
          style={{
            alignItems: "center",
            background: "#1f2937",
            borderRadius: 24,
            color: accent,
            display: "flex",
            fontSize: 48,
            height: 110,
            justifyContent: "center",
            width: 110,
          }}
        >
          {getNameInitials(profile.name)}
        </div>
        <div style={{ color: "#cbd5e1", display: "flex", fontSize: 25 }}>MyDevStudio</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            display: "flex",
            fontSize: profile.name.length > 30 ? 44 : 64,
            fontWeight: 700,
          }}
        >
          {profile.name.slice(0, 65)}
        </div>
        <div
          style={{
            color: accent,
            display: "flex",
            fontSize: profile.title.length > 60 ? 26 : 32,
          }}
        >
          {profile.title.slice(0, 100)}
        </div>
      </div>
      <div style={{ color: "#cbd5e1", display: "flex", fontSize: 24 }}>
        {portfolioUrl(username).replace(/^https?:\/\//, "")}
      </div>
    </div>,
    {
      headers: {
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex",
      },
      height: 630,
      width: 1200,
    },
  );
}

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
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: 64,
        background: "#111827",
        color: "#f9fafb",
        fontFamily: "sans-serif",
        borderBottom: `12px solid ${accent}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 110,
            height: 110,
            borderRadius: 24,
            background: "#1f2937",
            color: accent,
            fontSize: 48,
          }}
        >
          {getNameInitials(profile.name)}
        </div>
        <div style={{ display: "flex", fontSize: 25, color: "#cbd5e1" }}>
          MyDevStudio
        </div>
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
            display: "flex",
            fontSize: profile.title.length > 60 ? 26 : 32,
            color: accent,
          }}
        >
          {profile.title.slice(0, 100)}
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#cbd5e1" }}>
        {portfolioUrl(username).replace(/^https?:\/\//, "")}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex",
      },
    },
  );
}

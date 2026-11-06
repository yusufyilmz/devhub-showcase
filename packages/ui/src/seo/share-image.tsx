import { ImageResponse } from "next/og";

import { shareImageSize } from "./metadata";

type ShareImage = {
  accent: string;
  brand: string;
  initials: string;
  subtitle: string;
  title: string;
  url: string;
};

export function createShareImage(
  { accent, brand, initials, subtitle, title, url }: ShareImage,
  headers?: HeadersInit,
) {
  const headline = Array.from(title).slice(0, 72).join("");
  const detail = Array.from(subtitle).slice(0, 110).join("");
  return new ImageResponse(
    <div
      style={{
        backgroundColor: "#101724",
        backgroundImage: "linear-gradient(145deg, #101724 30%, #202b40 100%)",
        color: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
        height: "100%",
        justifyContent: "space-between",
        padding: "52px 64px",
        width: "100%",
      }}
    >
      <div style={{ alignItems: "center", display: "flex", gap: 18 }}>
        <div
          style={{
            alignItems: "center",
            background: "#232e42",
            border: `1px solid ${accent}`,
            borderRadius: 20,
            color: accent,
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            height: 64,
            justifyContent: "center",
            width: 64,
          }}
        >
          {initials}
        </div>
        <div style={{ color: "#cbd5e1", display: "flex", fontSize: 25 }}>{brand}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            display: "flex",
            fontSize: headline.length > 36 ? 54 : 72,
            fontWeight: 700,
            letterSpacing: "-0.035em",
            lineHeight: 1.06,
            overflowWrap: "anywhere",
          }}
        >
          {headline}
        </div>
        <div
          style={{
            color: "#cbd5e1",
            display: "flex",
            fontSize: detail.length > 60 ? 28 : 34,
            lineHeight: 1.25,
            overflowWrap: "anywhere",
          }}
        >
          {detail}
        </div>
      </div>
      <div
        style={{
          alignItems: "center",
          borderTop: "1px solid #41506a",
          color: "#e2e8f0",
          display: "flex",
          fontSize: 22,
          gap: 16,
          paddingTop: 25,
        }}
      >
        <div style={{ background: accent, borderRadius: 5, height: 10, width: 10 }} />
        {url}
      </div>
    </div>,
    { ...shareImageSize, headers },
  );
}

import type { Metadata } from "next";

export const shareImageSize = { height: 630, width: 1200 } as const;

type PageMetadata = Pick<Metadata, "icons" | "keywords" | "robots"> & {
  canonical: string;
  description: string;
  image?: { alt: string; url: string };
  locale?: string;
  siteName: string;
  title: string;
  type?: "profile" | "website";
};

export function createPageMetadata({
  canonical,
  description,
  icons,
  image,
  keywords,
  locale,
  robots,
  siteName,
  title,
  type = "website",
}: PageMetadata): Metadata {
  const images = image ? [{ ...image, ...shareImageSize }] : undefined;
  return {
    alternates: { canonical },
    description,
    icons,
    keywords,
    metadataBase: new URL(canonical).toString(),
    openGraph: {
      description,
      images,
      locale,
      siteName,
      title,
      type,
      url: canonical,
    },
    robots,
    title,
    twitter: {
      card: images ? "summary_large_image" : "summary",
      description,
      images,
      title,
    },
  };
}

export function createStructuredData<T extends { "@type": string }>(data: T) {
  return { ...data, "@context": "https://schema.org" as const };
}

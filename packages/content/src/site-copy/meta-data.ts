import type { Metadata } from "next";
import { profile } from "../profile";

export const metadata: Metadata = {
  metadataBase: new URL(profile.website),
  title: `${profile.name} | ${profile.title}`,
  description: profile.summary,
  keywords: [
    "Yusuf Yilmaz",
    "full-stack developer",
    "frontend developer",
    "software engineer",
    "React developer",
    "Next.js",
    "portfolio",
    "Yusuf Yilmaz portfolio",
    "developer portfolio",
    "web developer",
    "JavaScript developer",
    "Node.js",
  ],
  icons: {
    icon: "/favicon_yusuf.ico",
    apple: "/apple_touch_icon_yusuf.png",
    other: [
      {
        rel: "android",
        url: "android_icon_yusuf.png",
      },
    ],
  },
  openGraph: {
    type: "website",
    url: "https://yusufdevhub.vercel.app",
    title: `${profile.name} | ${profile.title}`,
    description:
      "Check out the portfolio of Yusuf Yilmaz, a skilled full-stack developer. Find projects and achievements in React, Next.js, Node.js, and more.",
    images: [
      {
        url: "https://yusufdevhub.vercel.app/preview_image.png",
        width: 800,
        height: 600,
        alt: "Preview image of Yusuf Yilmaz portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@yusufyilmz",
    title: `${profile.name} | ${profile.title}`,
    description:
      "Explore the portfolio of Yusuf Yilmaz, a full-stack developer skilled in modern tech stacks.",
    images: ["https://yusufdevhub.vercel.app/preview_image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://yusufdevhub.vercel.app",
  },
};

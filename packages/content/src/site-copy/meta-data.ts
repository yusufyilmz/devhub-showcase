import type { Metadata } from "next";

import { profile } from "../profile";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://yusufdevhub.vercel.app",
  },
  description: profile.summary,
  icons: {
    apple: "/apple_touch_icon_yusuf.png",
    icon: "/favicon_yusuf.ico",
    other: [
      {
        rel: "android",
        url: "android_icon_yusuf.png",
      },
    ],
  },
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
  metadataBase: new URL(profile.website),
  openGraph: {
    description:
      "Check out the portfolio of Yusuf Yilmaz, a skilled full-stack developer. Find projects and achievements in React, Next.js, Node.js, and more.",
    images: [
      {
        alt: "Preview image of Yusuf Yilmaz portfolio",
        height: 600,
        url: "https://yusufdevhub.vercel.app/preview_image.png",
        width: 800,
      },
    ],
    title: `${profile.name} | ${profile.title}`,
    type: "website",
    url: "https://yusufdevhub.vercel.app",
  },
  robots: {
    follow: true,
    index: true,
  },
  title: `${profile.name} | ${profile.title}`,
  twitter: {
    card: "summary_large_image",
    description:
      "Explore the portfolio of Yusuf Yilmaz, a full-stack developer skilled in modern tech stacks.",
    images: ["https://yusufdevhub.vercel.app/preview_image.png"],
    site: "@yusufyilmz",
    title: `${profile.name} | ${profile.title}`,
  },
};

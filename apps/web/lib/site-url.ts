/** One platform origin for canonical URLs; a profile's website is an outbound link. */
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || 'https://mydevstudio.vercel.app'
).origin
export const portfolioUrl = (username: string) =>
  `${siteUrl}/${encodeURIComponent(username)}`

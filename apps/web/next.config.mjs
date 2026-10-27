/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@shared/ui',
    '@shared/content',
    '@shared/lib',
    '@shared/chat',
    '@shared/cache'
  ],
  serverExternalPackages: ['openai', 'pino', '@prisma/client']
}
export default nextConfig

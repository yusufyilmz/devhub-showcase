/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // TypeScript 7 provides the native CLI rather than the legacy JavaScript API.
  experimental: { useTypeScriptCli: true },
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
